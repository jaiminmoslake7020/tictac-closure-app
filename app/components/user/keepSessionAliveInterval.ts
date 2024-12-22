import {UserType} from '@types-dir/index';
import {updateUser} from '@firebase-dir/index';

export const keepSessionAlive = async () => {
  const u = JSON.parse(localStorage.getItem('user') as string) as UserType;
  if (u.id) {
    await updateUser(u.id, (new Date()).getTime());
  }
}

export const keepSessionAliveInterval = async () => {
  await keepSessionAlive();
  setInterval(await keepSessionAlive, 15000);
}
