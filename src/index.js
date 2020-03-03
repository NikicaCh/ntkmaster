import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
require('dotenv').config()


const firebase = require("firebase");
require("firebase/firestore");


const app = firebase.initializeApp({ 
    apiKey: "AIzaSyDL3zNBxGXra7SuJ3dUmbzhhlF5cX5t014",
    authDomain: "ntkmaster202.firebaseapp.com",
    databaseURL: "https://ntkmaster202.firebaseio.com",
    projectId: "ntkmaster202",
    storageBucket: "ntkmaster202.appspot.com",
    messagingSenderId: "593618568565",
    appId: "1:593618568565:web:8d40d1d89da1a5d730bf3c" });
const db = firebase.firestore(app);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
