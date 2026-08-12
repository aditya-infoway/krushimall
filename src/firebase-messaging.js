import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      console.warn("Firebase Messaging is unavailable.");
      return null;
    }

    if (!("Notification" in window)) {
      console.warn("Notifications are not supported.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BGyHp5Oi3lfp9VjqTdSIemSUpfUAkXWouD1qBBgo41MJVnBzSVelVh-GkNIYZ6j-0k3v75pQyRQHzpnmIv-YEGQ",
    });

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.warn("Firebase notification setup failed:", error);
    return null;
  }
};