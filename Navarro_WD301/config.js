const firebase = require("firebase/app");
const fireStore = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDVsHBzXDIBq1pOBVn1ynzyqYH87kLsfPU",
  authDomain: "kahit-ano-haha.firebaseapp.com",
  projectId: "kahit-ano-haha",
  storageBucket: "kahit-ano-haha.appspot.com",
  messagingSenderId: "940636063877",
  appId: "1:940636063877:web:d18644566b8b2a5742c1ec",
  measurementId: "G-Q0ZTRX66S1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = fireStore.getFirestore(firebaseApp);

module.exports = db;