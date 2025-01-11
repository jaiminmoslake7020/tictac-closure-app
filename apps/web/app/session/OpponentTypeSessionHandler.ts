import {getUser} from '@session/UserSessionHandler';
import {getSession, setSession} from '@session/SessionHandler';
import {OpponentType} from '@types-dir/index';

const OpponentTypeSessionHandler = () => {

  const getOpponentType = () => {
    if (getUser()) {
      return getSession().opponentType;
    }
  }

  const setOpponentType = (opponentType: OpponentType) => {
    if (getUser()) {
      setSession({
        ...getSession(),
        opponentType
      });
    }
  }

  const removeOpponentType = () => {
    if (getUser()) {
      setSession({
        ...getSession(),
        opponentType: undefined
      });
    }
  }

  return {
    getOpponentType,
    setOpponentType,
    removeOpponentType
  }
}

const {
  getOpponentType,
  setOpponentType,
  removeOpponentType
} = OpponentTypeSessionHandler();

export {
  getOpponentType,
  setOpponentType,
  removeOpponentType
};
