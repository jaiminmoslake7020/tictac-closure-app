import {AppLevelType, ColumnIdType} from '@types-dir/index';

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


export const clickedHelper = () => {
  let clickedCollection : Map<ColumnIdType, boolean> = new Map();

  const setClicked = (columnId : ColumnIdType) => {
    clickedCollection.set(columnId, true);
  }

  const setUnClicked = (columnId : ColumnIdType) => {
    clickedCollection.set(columnId, false);
  }

  const getClicked = (columnId : ColumnIdType) => {
    if (
      clickedCollection.get(columnId)
    ) {
      return clickedCollection.get(columnId);
    }
    return false;
  }

  return {
    setClicked,
    setUnClicked,
    getClicked
  };
}


export const OnClickCollection = () => {
  let functionCollection : Map<ColumnIdType, any> = new Map();

  const addFn = (id: ColumnIdType, fun: any) => {
    functionCollection.set(id, fun)
  }

  const getFn = (id: ColumnIdType) => {
    return functionCollection.get(id)
  }

  const hasFn = (id: ColumnIdType) => {
    return functionCollection.has(id)
  }

  return {
    getFn, addFn, hasFn
  };
}


export const TdCollection = () => {
  let TdCollectionVar : Map<ColumnIdType, HTMLDivElement> = new Map();

  const addTd = (id: ColumnIdType, el: HTMLDivElement) => {
    TdCollectionVar.set(id, el)
  }

  const getTd = (id: ColumnIdType) : HTMLDivElement => {
    return TdCollectionVar.get(id) as HTMLDivElement;
  }

  const hasTd = (id: ColumnIdType) => {
    return TdCollectionVar.has(id)
  }

  return {
    addTd, getTd, hasTd
  };
}

export const TdCellCollection = () => {
  let TdCellCollectionVar : Map<ColumnIdType, any> = new Map();

  const addTdCell = (id: ColumnIdType, fun: any) => {
    TdCellCollectionVar.set(id, fun)
  }

  const getTdCell = (id: ColumnIdType) => {
    return TdCellCollectionVar.get(id)
  }

  const hasTdCell = (id: ColumnIdType) => {
    return TdCellCollectionVar.has(id)
  }

  return {
    addTdCell, getTdCell, hasTdCell
  };
}
