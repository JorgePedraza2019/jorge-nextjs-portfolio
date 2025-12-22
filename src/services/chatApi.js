import api from "./httpClient";

export async function sendMessageToChat(message) {
  const res = await api.post("/chat", { message });
  return res.data;
}