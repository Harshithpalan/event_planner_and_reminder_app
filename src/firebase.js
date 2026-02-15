import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAup3_6BacajVRJe2reWm9jRCW7SWE9SrQ",
    authDomain: "event-planner-2dd2f.firebaseapp.com",
    projectId: "event-planner-2dd2f",
    storageBucket: "event-planner-2dd2f.firebasestorage.app",
    messagingSenderId: "205605188995",
    appId: "1:205605188995:web:9489565c7ccf6e914772b6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
