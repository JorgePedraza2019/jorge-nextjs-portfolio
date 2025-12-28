// src/services/emailApi.js
import api from "./httpClient";

export const sendContactEmail = async (payload) => {
  const response = await api.post("/email/send", payload);
  return response.data;
};