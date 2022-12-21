// firebase.tsx
import { initializeApp, getApp } from "firebase/app";
//test

const firebaseConfig = {
  apiKey: "AIzaSyDL3zNBxGXra7SuJ3dUmbzhhlF5cX5t014",
  authDomain: "ntkmaster202.firebaseapp.com",
  databaseURL: "https://ntkmaster202.firebaseio.com",
  projectId: "ntkmaster202",
  storageBucket: "ntkmaster202.appspot.com",
  messagingSenderId: "593618568565",
  appId: "1:593618568565:web:8d40d1d89da1a5d730bf3c",
  measurementId: "G-8QZSLRMB4Z",
};

const app = initializeApp(firebaseConfig);

export { app };
