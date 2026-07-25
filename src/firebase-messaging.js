import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
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
    console.error(error);
  }
};