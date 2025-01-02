import {OpponentType} from '@types-dir/index';
import {OpponentSelectionForm} from '@components/game/opponent-selection/OpponentSelectionForm';
import {AskForAppLevelType} from '@components/game/info-tab/AskForAppLevelType';
import {addToRoot} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {CheckRoomSelected} from '@components/game/opponent-selection/remote-friend-player/CheckRoomSelected';
import {
  InitializeContextsFunctionType,
  useContextOpponentType,
  UseOpponentTypeHookType,
} from '@contexts/index';
import {useState} from '@components/base';
import {GameActionCallbacksType, GameActions} from '@components/game/GameActions';

export type OpponentSelectionType = {
  render : () => Promise<HTMLDivElement | undefined>,
  remove : () => void
};

export const OpponentSelection = (contextsData: InitializeContextsFunctionType, onLevelSelected: () => void, gameActions: GameActionCallbacksType ) :OpponentSelectionType => {

  const {
    get: getVarOne, set: setVarOne
  } = useState();

  const { setOpponentType, hasOpponentType, getOpponentType  } = useContextOpponentType( contextsData ) as UseOpponentTypeHookType;


  const askAppLevelType = () => {
    const t = AskForAppLevelType( onLevelSelected , false, contextsData);
    const f = t.render();
    if ( f ) {
      const gA = GameActions(contextsData, gameActions);
      addToRoot(Layout(f, gA));
    }
  }

  const onPlayerSelected = async (value: OpponentType) => {
    setOpponentType(value);
    if (value === 'computer-program') {
      askAppLevelType();
    } else if (value === 'remote-friend-player') {
      await (CheckRoomSelected(
        contextsData, onLevelSelected, gameActions
      )).startCheckRoomSelected();
    }
  }

  const showForm = () :HTMLDivElement  => {
    setVarOne((OpponentSelectionForm(onPlayerSelected)));
    return getVarOne().render();
  }

  const render = async () => {
    if ( hasOpponentType() ) {
      console.log('OpponentType Exists', getOpponentType());
      await onPlayerSelected(getOpponentType());
      return Promise.resolve(undefined);
    } else {
      return Promise.resolve(showForm());
    }
  }

  const remove = () => {
    getVarOne().remove();
  }

  return {
    render,
    remove
  };
}
