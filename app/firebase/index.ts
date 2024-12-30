import {
  listenToDocument, listenToCollection
} from './core';
import {
  addUser, updateUser, unliveUser, upsertUser
} from './user';
import {
  getRoomData, roomExists, joinRoom, createRoom
} from './room';
import {
  addNewTurnFirebase, updateGameWithCurrentMove, setWinner
} from './game';

export {
  listenToDocument, listenToCollection,
  addUser, updateUser, unliveUser, upsertUser,
  getRoomData, roomExists, joinRoom, createRoom,
  addNewTurnFirebase, updateGameWithCurrentMove, setWinner
};

