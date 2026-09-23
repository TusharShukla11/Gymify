import api from "./api";

export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  return response.data;
}