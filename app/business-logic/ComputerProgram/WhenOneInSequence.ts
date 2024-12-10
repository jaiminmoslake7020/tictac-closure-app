import {MovePositionType, WiningSequenceType} from '../../types';

export const WhenOneInSequence = (
  seq: WiningSequenceType,
  currentValues: MovePositionType[],
  anotherCurrentValues: MovePositionType[],
) => {
  let foundAnotherMove = null;
  if (
    ( currentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) )
  ) {
    if ( seq[0] === "11" || seq[0] === "13"  ) {
      foundAnotherMove = seq[1];
    } else {
      foundAnotherMove = seq[2];
    }
  } else  if (
    ( currentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) )
  ) {
    foundAnotherMove = seq[2];
  } else  if (
    ( currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[1] ) )
  ) {
    if ( seq[0] === "33" || seq[0] === "31"  ) {
      foundAnotherMove = seq[1];
    } else {
      foundAnotherMove = seq[0];
    }
  }
  return foundAnotherMove;
}
