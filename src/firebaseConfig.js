import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCwmxieTD0hacQvBItkTERUccV5GWhvoVI",
    authDomain: "josh-wine-manager-db.firebaseapp.com",
    databaseURL: "https://josh-wine-manager-db.firebaseio.com",
    projectId: "josh-wine-manager-db",
    storageBucket: "josh-wine-manager-db.appspot.com",
    messagingSenderId: "859432158072",
    appId: "1:859432158072:web:7e2e9f7bff2f630708fe8d"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = firebaseApp.database();

export default database;