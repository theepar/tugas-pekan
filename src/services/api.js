import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

export const booksApi = {
  list: (signal) =>
    api.get("/books", { signal }).then((response) => response.data),
  create: (book) => api.post("/books", book).then((response) => response.data),
  update: (id, book) =>
    api.put(`/books/${id}`, book).then((response) => response.data),
  remove: (id) => api.delete(`/books/${id}`),
};

export function apiError(error) {
  if (axios.isCancel(error)) return "";
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  return (
    message ||
    "API belum dapat dihubungi. Pastikan backend dan database berjalan."
  );
}
