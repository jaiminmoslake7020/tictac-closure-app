import {
  getRandomMove,
  InitializeContextsFunctionType,
  UseAnotherPlayerHookType,
  useContextAnotherPlayer,
  useContextCurrentMove,
  useContextGameId, useContextGamePlayerType,
  useContextRoomCodeId,
  useContextUserSession,
  UseCurrentMoveHookType,
  UseRoomCodeIdHookType
} from '@contexts/index';
import {getRoomData, setCreatorIsInRoom, setJoinerIsInRoom} from '@firebase-dir/room';
import {FirebaseGameType, GamePlayerType, RoomReadyResponseType, UserType} from '@types-dir/index';
import {RoomSelection} from './room-selection/RoomSelection';
import {addToRoot, createEL} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {createGame, onGameCreated} from '@firebase-dir/game';
import {IconButton} from '@components/base/html/Button';
import {NotificationSecondaryAction} from '@components/base/ux/notification/NotificationSecondaryAction';
import {NotificationHandler} from '@components/base/ux/notification/NotificationHandler';
import {Loader} from '@components/base';
import {isRoomReady} from '@utils/room';
import {GameActionCallbacksType, GameActions, GameActionsType} from '@components/game/GameActions';
import {StartGame} from '@components/game/opponent-selection/remote-friend-player/StartGame';

export const CheckRoomSelected = (
  contextsData: InitializeContextsFunctionType,
  onLevelSelected: () => void,
  gameActions: GameActionCallbacksType
) => {

  const { setAnotherPlayer } = useContextAnotherPlayer(contextsData) as UseAnotherPlayerHookType;
  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;
  const { setRoomCodeId, removeRoomCodeId } = useContextRoomCodeId(contextsData) as UseRoomCodeIdHookType;
  const {
    getUser
  } = useContextUserSession(contextsData);
  const {
    setGameId, getGameId, hasGameId, removeGameId
  } = useContextGameId(contextsData);

  const {
    setPlayerType
  } = useContextGamePlayerType( contextsData );

  const {
    showLoader, stopLoader
  } = Loader();

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

      const gA = GameActions(contextsData, gameActions) as GameActionsType;
      const div = createEL('div');
      addToRoot(Layout( div as HTMLElement, gA));
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

        const ib = IconButton('Logout', ' logout-btn ', 'fa-solid fa-power-off', gA.logout);
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

  let errorAdded = false;
  // TODO: change in some kind of subscription where we can remove the listener
  const addRoomSubscriber = async (v:RoomReadyResponseType) => {
    if (v.playerType === 'creator') {
      await setCreatorIsInRoom(v.roomCode);
    } else {
      await setJoinerIsInRoom(v.roomCode);
    }
    const roomData = await getRoomData(v.roomCode);
    if (roomData) {
      const t = isRoomReady(roomData);
      if (!t) {
        console.log('Room is left by another player');
        if (!errorAdded) {
          const gA = GameActions(contextsData, gameActions) as GameActionsType;
          const ib = IconButton('Re-create room', ' logout-btn ', 'fa-solid fa-power-off', gA.exitRoom);
          const n = NotificationSecondaryAction( ib as HTMLElement );
          const {
            addError
          } = NotificationHandler();
          addError('Room is left by another player.', null, n);
          errorAdded = true;
        } else {
          const gA = GameActions(contextsData, gameActions) as GameActionsType;
          gA.exitRoom()
        }

      }
    }
    setTimeout(addRoomSubscriber.bind(null, v), 10000);
  }

  const onRoomSelected = async (v:RoomReadyResponseType) => {
    console.log('ROOM', v.roomCode);
    setRoomCodeId(v.roomCode);
    setAnotherPlayer(v.anotherPlayer);
    await StartGame(contextsData, gameActions).startProcess(v);
    await addRoomSubscriber(v);
  }

  const askRoomSelection = () => {
    const t = RoomSelection( contextsData , onRoomSelected );
    const f = t.render();
    if ( f ) {
      const gameActionsNewObject = GameActions(contextsData, gameActions);
      addToRoot(Layout(f, gameActionsNewObject));
    }
  }

  const startCheckRoomSelected = async () => {
    const { hasRoomCodeId, getRoomCodeId } = useContextRoomCodeId(contextsData) as UseRoomCodeIdHookType;
    if (
      hasRoomCodeId()
    ) {
      const roomCodeId = getRoomCodeId();
      const roomData = await getRoomData(roomCodeId);
      if (roomData) {
        // check if room is having player and joiner online
        if (
          isRoomReady(roomData)
        ) {
          const userId = getUser().id;
          const playerType :GamePlayerType = userId === roomData['creator'].id ? 'creator' : 'joiner';
          const anotherPlayer = playerType === 'creator' ? roomData['joiner'] as UserType : roomData['creator'] as UserType;
          setPlayerType(playerType);
          setAnotherPlayer(anotherPlayer);
          console.log("ROOM", roomCodeId, playerType, hasGameId(), getGameId());
          if (hasGameId() && getGameId()) {
            console.log('Game already started', getGameId());
            await addRoomSubscriber({
              roomCode: roomCodeId,
              anotherPlayer,
              playerType
            });

          } else {
            console.log('Game needs to be started');
            await startGame(anotherPlayer, roomCodeId, playerType);
          }
        } else {
          removeGameId();
          removeRoomCodeId();
          console.log("Room is not ready");
          askRoomSelection();
        }
      } else {
        removeGameId();
        removeRoomCodeId();
        console.log("Room does not exist");
        askRoomSelection();
      }
    } else {
      console.log('ROOM', getRoomCodeId());
      askRoomSelection();
    }
  }

  return {
    startCheckRoomSelected
  }

}
