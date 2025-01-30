import { Firestore } from '@firebase/firestore';
import { FirebaseApp } from '@firebase/app';
import { Auth } from '@firebase/auth';
import { Analytics } from '@firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export const lambdaChatgptApiUrl = process.env.LAMBDA_CHATGPT_PLAYER_API_URL as string;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIG_API_KEY as string,
  authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_CONFIG_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET as string,
  messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID as string,
  appId: process.env.FIREBASE_CONFIG_APP_ID as string,
  measurementId: process.env.FIREBASE_CONFIG_MEASUREMENT_ID as string,
};
// Initialize Firebase

let firestore: undefined | Firestore;
let app: undefined | FirebaseApp;
let auth: undefined | Auth;
let analytics: undefined | Analytics;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirestoreAuth = (): Auth => {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth as Auth;
};

export const getFirebaseAnalytics = (): Analytics => {
  if (!auth) {
    analytics = getAnalytics(getFirebaseApp());
  }
  return analytics as Analytics;
};

export const getFirestoreObject = (): Firestore => {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
};

// Listen for real-time updates to a specific document
export const listenToDocument = (
  collectionName: string,
  documentId: string,
  onRetrieve: (d: any) => void
) => {
  const db = getFirestoreObject();
  const docRef = doc(db, collectionName, documentId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        onRetrieve(docSnapshot.data());
      } else {
        console.log('Document does not exist');
      }
    },
    (error) => {
      console.error('Error listening to document changes:', error);
    }
  );

  return unsubscribe; // Call this function to stop listening
};

// Listen for real-time updates to a specific document
export const listenToCollection = (
  collectionName: string,
  onRetrieve: (d: any, length: number) => void
) => {
  const db = getFirestoreObject();
  const collectionRef = collection(db, collectionName);

  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const length = snapshot.docChanges().length;
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          onRetrieve(change.doc.data(), length);
        }
      });
    },
    (error) => {
      console.error('Error listening to collection changes:', error);
    }
  ); // Call this function to stop listening
};

// Listen for real-time updates to a specific document
export const listenToCollectionV2 = (
  collectionName: string,
  onRetrieve: (d: any, l: number) => void,
  onFinished: () => void
) => {
  const db = getFirestoreObject();
  const collectionRef = collection(db, collectionName);

  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const length = snapshot.docChanges().length;
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          onRetrieve(change.doc, length);
        }
      });
    },
    (error) => {
      console.error('Error listening to collection changes:', error);
      onFinished();
    },
    () => {
      onFinished();
    }
  ); // Call this function to stop listening
};

export const insertNewDocumentWithId = async (
  path: string,
  proposedDocId: string,
  docData: any
) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, path, proposedDocId);
    await setDoc(docRef, docData);
  } catch (e) {
    console.error('Error at insertNewDocumentWithId: ', path, proposedDocId, e);
  }
};

export const insertNewDocumentWithoutId = async (
  path: string,
  docData: any
) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, path);
    await setDoc(docRef, docData);
  } catch (e) {
    console.error('Error insertNewDocumentWithoutId: ', path, e);
  }
};

export const addDocument = async (
  collectionPath: string,
  docData: any
): Promise<any> => {
  try {
    const f = getFirestoreObject();
    const collectionRef = collection(f, collectionPath);
    return await addDoc(collectionRef, docData);
  } catch (e) {
    console.error('Error adding document:', collectionPath, e);
  }
};

export const updateDocument = async (path: string, updatedDocData: any) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, path);
    await updateDoc(docRef, updatedDocData);
  } catch (e) {
    console.error('Error updating firebase document:', path, updatedDocData, e);
  }
};

export const getDocument = async (path: string) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, path);
    return await getDoc(docRef);
  } catch (e) {
    console.error('Error getDocument:', path, e);
  }
};

export const deleteDocument = async (path: string) => {
  try {
    const f = getFirestoreObject();
    const docRef = doc(f, path);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error getDocument:', path, e);
    return false;
  }
};

// Fetch all documents
export const fetchAllDocuments = async (collectionName: string) => {
  try {
    const f = getFirestoreObject();
    const collectionRef = collection(f, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};
