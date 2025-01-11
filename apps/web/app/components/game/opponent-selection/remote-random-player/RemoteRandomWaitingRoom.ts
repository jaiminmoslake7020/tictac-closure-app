import {
  getGameDocumentPath,
  InitializeContextsFunctionType, useContextCurrentMove,
  useContextGameId, useContextGamePlayerType,
  useContextRoomCodeId,
  useContextUserSession
} from '@contexts/index';
import {GameActionCallbacksType, GameActions} from '@components/game/GameActions';
import {H2, Loader, useButton, useDiv} from '@components/base';
import {checkRoom, deleteWaitingRoomUser, joinWaitingRoom, updateRoom} from '@firebase-dir/waiting-room';
import {addToRoot, getCurrentTime} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {getGame} from '@firebase-dir/game';

export type RemoteRandomWaitingRoomType = {
  render : () => void,
  remove : () => void
}

export const RemoteRandomWaitingRoom = (contextsData: InitializeContextsFunctionType, onLevelSelected: () => void, gameActions: GameActionCallbacksType ) :RemoteRandomWaitingRoomType => {

  const {
    showLoader, addText, updateText, stopLoader
  } = Loader();

  let startTime = 0;
  let limitTime = 120;

  const {
    getDiv, setDiv,
  } = useDiv();

  const {
    getButton, setButton
  } = useButton()

  const renderRestartAfterSomeTimeButton = () => {
    setDiv('main restart-after-some-time-wrapper');
    setButton('Restart', 'restart-after-some-time-btn', () => {
      remove();
      showLoader();
      addText('Waiting for other Player to join!');
      startTime = 0;
      updateRoomSubscriber().then(() => {
        // console.log('Room updated')
      });
    });
    getDiv().append(H2('Please try again later!'));
    getDiv().append(getButton());
    const gameActionsComponent = GameActions(contextsData, gameActions);
    addToRoot(Layout(getDiv() as HTMLDivElement, gameActionsComponent));
  }

  const updateRoomFun = async () => {
    const { getUser } = useContextUserSession(contextsData);
    if (getUser() && getUser().id) {
      await updateRoom(getUser().id, getCurrentTime());
    }
    updateText(`Waiting for other Player to join! ${120 - startTime}s`);
    startTime++;
  }

  const checkRoomFun = async () => {
    const { getUser } = useContextUserSession(contextsData);
    return await checkRoom(getUser().id);
  }

  const updateRoomSubscriber = async () => {
    const interval = setInterval(() => {
      const { getUser } = useContextUserSession(contextsData);
      if ( !(getUser() && getUser().id) ) {
        // console.log('User not found');
        clearInterval(interval)
        stopLoader();
        renderRestartAfterSomeTimeButton();
      } else if (startTime >= limitTime) {
        // console.log('Timedout');
        clearInterval(interval);
        stopLoader();
        renderRestartAfterSomeTimeButton();
      } else {
        checkRoomFun().then((data) => {
          if (data && data.gameId && data.roomId && data.playerType) {
            const {roomId, gameId, playerType} = data;
            // console.log('Room found', roomId, gameId);
            const {
              setRoomCodeId
            } = useContextRoomCodeId(contextsData);
            const {
              setGameId
            } = useContextGameId(contextsData);
            const {
              setPlayerType
            } = useContextGamePlayerType(contextsData);
            setRoomCodeId(roomId);
            setGameId(gameId);
            setPlayerType(playerType);
            const gameDocumentPath = getGameDocumentPath(contextsData);
            if (gameDocumentPath) {
              getGame(gameDocumentPath).then((gameData) => {
                if (gameData) {
                  const {
                    currentMove
                  } = gameData;
                  const {
                    setCurrentMove
                  } = useContextCurrentMove(contextsData);
                  setCurrentMove(currentMove);
                  stopLoader();
                  clearInterval(interval);
                  deleteWaitingRoomUser(getUser().id);
                  onLevelSelected();
                } else {
                  console.error('Game document data not found');
                }
              });
            } else {
              console.error('Game document path not found');
            }
          } else {
            updateRoomFun().then(() => {
              // console.log('Room updated',  parseInt(String(getCurrentTime() / 1000)) )
            });
          }
        });
      }
    }, 1000);
  }

  const adduserToRoom = async () => {
    const { getUser } = useContextUserSession(contextsData);
    await joinWaitingRoom(getUser());
  }

  const render = () => {
    showLoader();
    addText('Waiting for other Player to join!');
    adduserToRoom().then(() => {
      // console.log('User added to room')
    });
    updateRoomSubscriber().then(() => {
      // console.log('Room updated')
    });
  }

  const remove = () => {
    getDiv().remove();
  }

  return {
    render,
    remove
  }
}
