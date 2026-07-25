import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDrVxjX2AZ05YS9lUcf6CukXJejieFPT04",
  authDomain: "krushimall.firebaseapp.com",
  projectId: "krushimall",
  storageBucket: "krushimall.firebasestorage.app",
  messagingSenderId: "154038392206",
  appId: "1:154038392206:web:13b020fd5d313c166100df",
  measurementId: "G-RXMSGR3415",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);