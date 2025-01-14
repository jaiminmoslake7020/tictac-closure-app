import * as admin from 'firebase-admin';

let app: admin.app.App | undefined = undefined;
const getFirebaseApp = (): admin.app.App => {
  if (app) {
    return app;
  } else {
    const firebasePrivateKey = Buffer.from(
      process.env.FIREBASE_PRIVATE_KEY_BASE64 as string,
      'base64',
    ).toString('utf-8');

    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey,
      }),
    });
    return app;
  }
};

const getFirestoreObject = () => {
  return getFirebaseApp().firestore();
};

export const fetchAllDocuments = async (collectionName: string) => {
  try {
    const f = getFirestoreObject();
    const collectionRef = f.collection(collectionName);
    const querySnapshot = await collectionRef.listDocuments();
    // console.log('Documents:', documents);
    const allDocs = querySnapshot.map(async (doc) => {
      const data = (await doc.get()).data();
      return {
        id: doc.id, // Document ID
        ...data, // Document data
      };
    });
    return await Promise.all(allDocs);
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

export const addDocument = async (
  collectionPath: string,
  docData: any,
): Promise<any> => {
  try {
    const f = getFirestoreObject();
    const collectionRef = f.collection(collectionPath);
    return await collectionRef.add(docData);
  } catch (e) {
    console.error('Error adding document:', collectionPath, e);
  }
};

export const updateDocument = async (path: string, updatedDocData: any) => {
  try {
    const f = getFirestoreObject();
    const docRef = f.doc(path);
    await docRef.update(updatedDocData);
  } catch (e) {
    console.error('Error Updating document', path, updatedDocData, e);
  }
};
