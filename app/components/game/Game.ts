import {addToRoot, createEL} from '@utils/index'
import { AskForAppLevelType } from '@components/game/info-tab/AskForAppLevelType';
import {LoadTicTacApp, LoadTicTacAppType} from '@tic-tac/LoadTicTacApp';
import {
  UseOpponentTypeHookType, getRandomMove, useContextGameId, useContextUserSession,
  UseAnotherPlayerHookType, InitializeContextsFunctionType, useContextAnotherPlayer, useContextCurrentMove,
  useContextOpponentType, useContextRoomCodeId,
} from '@contexts/index';
import {
  FirebaseGameType,
  GameActionsType,
  GamePlayerType,
  OpponentType,
  RoomReadyResponseType,
  UserType
} from '@types-dir/index';
import {RoomSelection} from './room-selection/RoomSelection';
import {UseCurrentMoveHookType} from '@contexts/index';
import {UseRoomCodeIdHookType} from '@contexts/index';
import {PlayerSelection} from '@components/player-selection/PlayerSelection';
import {createGame, onGameCreated} from '@firebase-dir/game';
import {getRoomData} from '@firebase-dir/room';
import {Loader, useState} from '@components/base';
import {Layout} from '@components/layouts/layout/Layout';
import {GameActions} from './GameActions';
import {removeGameId} from '@session/GameSessionHandler';
import {NotificationHandler} from '@components/base/ux/notification/NotificationHandler';
import {NotificationSecondaryAction} from '@components/base/ux/notification/NotificationSecondaryAction';
import {IconButton} from '@components/base/html/Button';

export const Game = ( contextsData: InitializeContextsFunctionType , onLogout : () => void) => {

  const { setOpponentType, hasOpponentType, getOpponentType  } = useContextOpponentType( contextsData ) as UseOpponentTypeHookType;
  const { setAnotherPlayer } = useContextAnotherPlayer(contextsData) as UseAnotherPlayerHookType;
  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;
  const { setRoomCodeId } = useContextRoomCodeId(contextsData) as UseRoomCodeIdHookType;
  const {
    getUser
  } = useContextUserSession(contextsData);
  const {
    setGameId, getGameId, hasGameId
  } = useContextGameId(contextsData);

  const {
    get: getGameActions, set: setGameActions
  } = useState() as {
    get: () => GameActionsType,
    set: (item:GameActionsType) => void
  };

  const {
    get, set
  } = useState() as {
    get: () => LoadTicTacAppType,
    set: (item: LoadTicTacAppType) => void
  };

  const {
    showLoader, stopLoader
  } = Loader();

  const onLevelSelected = () => {
    addToRoot( Layout( LoadTicTacApp( contextsData ).render() , getGameActions()) );
  }

  const askAppLevelType = () => {
    const t = AskForAppLevelType( onLevelSelected , false, contextsData);
    const f = t.render();
    if ( f ) {
      addToRoot(Layout(f, getGameActions()));
    }
  }

  const startGame = async (anotherPlayer: UserType, roomCodeId: string, playerType: GamePlayerType) => {
    if (playerType === 'joiner') {
      const userItem = getUser() as UserType;
      const currentMove = getRandomMove(contextsData);
      const g = await createGame(roomCodeId, currentMove, userItem.id);
      if (g) {
        console.log('GAME CREATED BY ME', g.id);
        setGameId(g.id);
        setCurrentMove(currentMove);
        onLevelSelected();
      } else {
        // TODO: Show error message
        console.log('Error creating game by me');
      }
    } else {
      let oneTimeExecution = false;

      const div = createEL('div');
      addToRoot(Layout( div as HTMLElement, getGameActions()));
      showLoader();


      // console.log("onGameCreated");
      onGameCreated(roomCodeId, async (d: FirebaseGameType, gameId: string) => {
        // console.log('onGameCreated Inside Fane ', d, gameId);
        if (
          !hasGameId() &&
          oneTimeExecution === false
        ) {
          console.log('Game started Game 1', gameId);
          oneTimeExecution = true;
          setGameId(gameId);
          setCurrentMove(d.currentMove);
          stopLoader();
          onLevelSelected();
        } else {
          console.log('GAME ALREADY STARTED onGameCreated', getGameId(), hasGameId(), oneTimeExecution);
        }
      }, () => {

        const ib = IconButton('Logout', ' logout-btn ', 'fa-solid fa-power-off', getGameActions().logout);
        const n = NotificationSecondaryAction( ib as HTMLElement );
        const {
          addError
        } = NotificationHandler();
        addError('Game not started, Please try again', null, n);

        stopLoader();
        console.log('Game started Game 2');
      });

    }
  }

  const onRoomSelected = async (v:RoomReadyResponseType) => {
    setRoomCodeId(v.roomCode);
    setAnotherPlayer(v.anotherPlayer);
    await startGame(v.anotherPlayer, v.roomCode, v.playerType);
  }

  const askRoomSelection = () => {
    const t = RoomSelection( contextsData , onRoomSelected );
    const f = t.render();
    if ( f ) {
      // can have logout button
      addToRoot(Layout(f, getGameActions()));
    }
  }

  const checkRoomSelected = async () => {
    const { hasRoomCodeId, getRoomCodeId } = useContextRoomCodeId(contextsData) as UseRoomCodeIdHookType;
    if (
      hasRoomCodeId()
    ) {
      const roomCodeId = getRoomCodeId();
      const roomData = await getRoomData(roomCodeId);
      if (roomData && roomData.exists()) {
        const data = roomData.data() as {
          'creator': UserType,
          'joiner': UserType
        };
        if (data['creator'] && data['joiner']) {
          const userId = getUser().id;
          const playerType :GamePlayerType = userId === data['creator'].id ? 'creator' : 'joiner';
          const anotherPlayer = playerType === 'creator' ? data['joiner'] : data['creator'];
          setAnotherPlayer(anotherPlayer);
          console.log("ROOM", roomCodeId, playerType);
          removeGameId();
          await startGame(anotherPlayer, roomCodeId, playerType);
        } else {
          console.log("Room is not ready");
          askRoomSelection();
        }
      } else {
        console.log("Room does not exist");
        askRoomSelection();
      }
    } else {
      console.log('ROOM', getRoomCodeId());
      askRoomSelection();
    }
  }

  const onPlayerSelected = async (value: OpponentType) => {
    setOpponentType(value);
    if (value === 'computer-program') {
      askAppLevelType();
    } else if (value === 'remote-friend-player') {
      await checkRoomSelected();
    }
  }

  const init = async () => {
    const gameActions = GameActions(contextsData, init, init, onLogout);
    setGameActions(gameActions);
    if ( hasOpponentType() ) {
      console.log('OpponentType Exists', getOpponentType());
      await onPlayerSelected(getOpponentType());
    } else {
      const t = PlayerSelection(onPlayerSelected);
      const f = t.render();
      if ( f ) {
        addToRoot(Layout(f, gameActions));
      }
    }
  }

  return {
    init
  }
}
