import {addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc} from 'firebase/firestore';
import {Firestore} from '@firebase/firestore';
import {FirebaseApp} from '@firebase/app';
import {initializeApp} from 'firebase/app';
import {MovePositionType, TurnType} from '../types';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIG_API_KEY as string,
  authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_CONFIG_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET as string,
  messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID as string,
  appId: process.env.FIREBASE_CONFIG_APP_ID as string,
  measurementId: process.env.FIREBASE_CONFIG_MEASUREMENT_ID as string,
};

let firestore: undefined | Firestore;
let app: undefined | FirebaseApp;
export const getFirestoreObject = (): Firestore => {
  if (!firestore) {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
  }
  return firestore;
}

// Listen for real-time updates to a specific document
export const listenToDocument = (collectionName:string, documentId: string, onRetrieve: (d:any) => void) => {
  const db = getFirestoreObject();
  const docRef = doc(db, collectionName, documentId);

  const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      console.log("Document data:", docSnapshot.data()); // Current document data
      onRetrieve( docSnapshot.data() );
    } else {
      console.log("No such document!");
    }
  }, (error) => {
    console.error("Error listening to document changes:", error);
  });

  return unsubscribe; // Call this function to stop listening
}

// Listen for real-time updates to a specific document
export const listenToCollection = (collectionName:string, onRetrieve: (d:any, length: number) => void) => {
  const db = getFirestoreObject();
  const collectionRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const length = snapshot.docChanges().length;
    console.log('snapshot.docChanges()', );
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New document added: ", change.doc.data());
        onRetrieve( change.doc.data() , length );
      }
    });
  }, (error) => {
    console.error("Error listening to document changes:", error);
  });

  return unsubscribe; // Call this function to stop listening
}


export const insertNewDocument = async (roomCode: string, userId: string, position: MovePositionType) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, `rooms/${roomCode}/turnStorage`, position);
    await setDoc(docRef, {userId, position});
  } catch (e) {
    console.log('e', e);
  }
};

export const updateDocument = async (roomCode: string, currentMove: string) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, `rooms`, roomCode);
    console.log('new CurrentMove updateDocument', currentMove)
    const updatedDocData = {currentMove};
    await updateDoc(docRef, updatedDocData);
  } catch (e) {
    console.log('e', e);
  }
};

export const getDocument = async (roomCode: string) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, `rooms`, roomCode);
    return await getDoc(docRef);
  } catch (e) {
    console.log('e', e);
  }
};
