import {AppLevelType} from '../types';

export const appLevelList = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
} as Record<AppLevelType, AppLevelType>;


export const StopAnimateMoveX = 200;

export const stopAnimateMoveSuccess = () => {
  let StopAnimateMoveSuccess = 100;

  const get = () => {
    return StopAnimateMoveSuccess;
  }

  const reset = () => {
    StopAnimateMoveSuccess = 100;
  }

  const increment = () => {
    StopAnimateMoveSuccess += 300;
  }

  return {
    get,
    increment,
    reset
  };
}
