import {appendEl, getBrowserName} from '../utils'
import { AskForAppLevelType } from './AskForAppLevelType';
import { LoadTicTacApp } from './LoadTicTacApp';
import {
  GameTypeHookType,
} from '../contexts/useGameLevel';
import {
  AnotherPlayerHookType,
} from '../contexts/useAnotherPlayer';
import {
  initializeContexts, useContextAnotherPlayer, useContextCurrentMove,
  useContextGameType
} from '../contexts';
import {OpponentType, RoomReadyResponseType} from '../types';
import {RoomSelection} from './RoomSelection';
import {CurrentMoveHookType} from '../contexts/useCurrentMove';

export const Game = () => {

  const contextsData = initializeContexts();
  const { setGameType  } = useContextGameType( contextsData ) as GameTypeHookType;
  const { setAnotherPlayer } = useContextAnotherPlayer(contextsData) as AnotherPlayerHookType;
  const { setCurrentMove } = useContextCurrentMove(contextsData) as CurrentMoveHookType;

  const onLevelSelected = () => {
    LoadTicTacApp( contextsData ).render();
  }

  const askAppLevelType = () => {
    const t = AskForAppLevelType( onLevelSelected , false, contextsData);
    const f = t.render();
    if ( f ) {
      appendEl('#root', f);
    }
  }

  const onRoomSelected = (v:RoomReadyResponseType) => {
    console.log('onRoomSelected', v);
    setAnotherPlayer(v.anotherPlayer);
    setCurrentMove(v.currentMove);
    setGameType('remote-friend-player');
    onLevelSelected();
  }

  const askRoomSelection = () => {
    const t = RoomSelection( onRoomSelected );
    const f = t.render();
    if ( f ) {
      appendEl('#root', f);
    }
  }

  const onPlayerSelected = (value: OpponentType) => {
    console.log('value', value);
    if (value === 'computer-program') {
      askAppLevelType();
    } else if (value === 'remote-friend-player') {
      askRoomSelection();
    }
  }

  const init = () => {
    if (getBrowserName() === "Google Chrome") {
      onRoomSelected({
        anotherPlayer: {
          id: 'vGKtmDa38Ky8CcOFnNld',
          username: "Armenia"
        },
        currentMove: 'vGKtmDa38Ky8CcOFnNld'
      });
    } else {
      onRoomSelected({
        anotherPlayer: {
          id: 'g6XKVylf1PVXpAjC2iPv',
          username: 'Michel'
        },
        currentMove: 'vGKtmDa38Ky8CcOFnNld'
      });
    }
    // askRoomSelection();
    // const t = PlayerSelection(onPlayerSelected);
    // const f = t.render();
    // if ( f ) {
    //   appendEl('#root', f);
    // }
  }

  return {
    init
  }
}
