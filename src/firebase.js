import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDrVxjX2AZ05YS9lUcf6CukXJejieFPT04",
  authDomain: "krushimall.firebaseapp.com",
  projectId: "krushimall",
  storageBucket: "krushimall.firebasestorage.app",
  messagingSenderId: "154038392206",
  appId: "1:154038392206:web:13b020fd5d313c166100df",
  measurementId: "G-RXMSGR3415",
};

export const app = initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.warn(
        "Firebase Messaging is not supported in this browser."
      );
      return null;
    }

    return getMessaging(app);
  } catch (error) {
    console.warn("Firebase Messaging unavailable:", error);
    return null;
  }
};