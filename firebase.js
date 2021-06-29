import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBGllTcQOlmpVotYxSzf_dd4HzxC2jyhss",
    authDomain: "r-native-income-tracker.firebaseapp.com",
    projectId: "r-native-income-tracker",
    storageBucket: "r-native-income-tracker.appspot.com",
    messagingSenderId: "168199575080",
    appId: "1:168199575080:web:041f69c8fd5fe4f991071d",
    measurementId: "G-ZNKT1NNY1Q"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };