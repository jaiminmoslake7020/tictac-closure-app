import {updateUser} from '@firebase-dir/index';
import {InitializeContextsFunctionType, useContextUserSession} from '@contexts/index';

export const keepSessionAlive = async (contextsData: InitializeContextsFunctionType) => {
  const {
    getUser
  } = useContextUserSession(contextsData);
  const u = getUser();
  if (u && u.id) {
    await updateUser(u.id, (new Date()).getTime());
  }
}

export const keepSessionAliveInterval = async (contextsData: InitializeContextsFunctionType) => {
  await keepSessionAlive( contextsData );
  setInterval(await keepSessionAlive, 15000);
}
