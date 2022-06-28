import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // auth state change observer
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ3MypsL2v6O0Kgb3E7jyEWlT1qPpbs-g",
  authDomain: "crwn-clothing-db-6c67e.firebaseapp.com",
  projectId: "crwn-clothing-db-6c67e",
  storageBucket: "crwn-clothing-db-6c67e.appspot.com",
  messagingSenderId: "327477417267",
  appId: "1:327477417267:web:963c76c720d1d325c61a46",
  measurementId: "G-27783GP1XZ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

// auth is used as our application or firebase instance authentication memory bank tracking all of our authentication state regardless of where our app is going
export const auth = getAuth();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

// DB instance
export const db = getFirestore();

// to add collection and doucuments in firestore
export const addCollectionAndDoucments = async (
  collectionKey,
  documentObjectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  documentObjectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });
  await batch.commit();
  console.log("Done");
};

// get categories and doucument from firestroe
export const getCategoriesAndDocumnets = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef); //we want create a query against this collection ref, this will give us an object that we can get a snapshot

  // getDocs() is the async ability to fetch those documents snapshot that we want.
  const querySnapshot = await getDocs(q);

  // now we able to access the different doucments snapshot of query snapshot, this will give us an array of all of those individual documents inside and the snapshots are the actucal data themselves.
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapShot) => {
    //first we destructure of the values of this doc snapshot
    const { title, items } = docSnapShot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;

  /* 
    {
      hats: {
        title: 'Hats',
        items: [
          {},
          {},
        ]
      }
       sneakers: {
        title: 'Sneakers',
        items: [
          {},
          {},
        ]
      }
    }
  */
};

// create user reference in database
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  // check if there is existing document reference (reference mean the actual instance of document model)
  const userDocRef = doc(db, "users", userAuth.uid); //1- database, 2- name of collection 3- name of document
  console.log(userDocRef);

  //get user data
  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  // if doucment does not exists create the doucment at the provided userDocRef
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (err) {
      console.log("Error in creating user", err.message);
    }
  }
  // if it exists just return the reference anyways
  return userDocRef;
};

// authentication with email and password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
