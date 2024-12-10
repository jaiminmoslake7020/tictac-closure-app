import {addDoc, collection, doc, getDoc, getFirestore, onSnapshot, updateDoc} from 'firebase/firestore';
import {Firestore} from '@firebase/firestore';
import {FirebaseApp} from '@firebase/app';
import {initializeApp} from 'firebase/app';

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
