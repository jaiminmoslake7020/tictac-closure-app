import {UserType} from '../../types';
import {getFirestoreObject} from '../../firebase';
import {doc, updateDoc} from 'firebase/firestore';

export const keepSessionAlive = async () => {
  const u = JSON.parse(localStorage.getItem('user') as string) as UserType;
  if (u.id) {
    const f = getFirestoreObject();
    const docRef = doc(f, 'users', u.id);
    await updateDoc(docRef, {
      live: (new Date()).getTime()
    });
  }
}

export const keepSessionAliveInterval = async () => {
  await keepSessionAlive();
  setInterval(await keepSessionAlive, 15000);
}
