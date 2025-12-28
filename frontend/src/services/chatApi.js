// src/services/chatApi.js
import api from "./httpClient";

export const queryRag = async (payload) => {
  const response = await api.post("/rag/query", payload);
  return response.data;
};