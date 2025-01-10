// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  User,
  onAuthStateChanged
} from "@firebase/auth";
import {getFirestoreAuth} from './core';

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/google-signin.md

const getGoogleProvider = () : GoogleAuthProvider => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  return provider;
}

export const showGoogleSignInPopup = async () : Promise<User> => {
  await setPersistence(getFirestoreAuth(), browserLocalPersistence);
  const r = await signInWithPopup(getFirestoreAuth(), getGoogleProvider());
  return r.user;
}

onAuthStateChanged(getFirestoreAuth(), (user) => {
  if (user) {
    // console.log("onAuthStateChanged User is signed in:", user);
  } else {
    localStorage.clear();
    window.location.reload();
  }
});
