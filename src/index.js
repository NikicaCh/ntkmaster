import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
require('dotenv').config()


const firebase = require("firebase");
require("firebase/firestore");


const app = firebase.initializeApp({
    apiKey: "AIzaSyAMElcbneox6gS4P74lwtLjWpOcxBLMq_w",
    authDomain: "ntkmaster-4b600.firebaseapp.com",
    databaseURL: "https://ntkmaster-4b600.firebaseio.com",
    projectId: "ntkmaster-4b600",
    storageBucket: "ntkmaster-4b600.appspot.com",
    messagingSenderId: "506995767744",
    appId: "1:506995767744:web:615eaacf826888d0"
});
const db = firebase.firestore(app);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
