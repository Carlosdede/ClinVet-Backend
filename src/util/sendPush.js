import axios from "axios";

export async function sendExpoPushNotification(to, title, body, data = {}) {
  try {
    const response = await axios.post("https://exp.host/--/api/v2/push/send", {
      to,
      title,
      body,
      sound: "default",
      data,
    });

    console.log("Expo Push enviado:", response.data);
  } catch (err) {
    console.error("Erro ao enviar push:", err.response?.data || err.message);
  }
}
