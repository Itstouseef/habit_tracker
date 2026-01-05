import api from "./axios";

// USER SIGNUP
export const signup = (data) => api.post("/signup", data);

// LOGIN (ADMIN + USER)
export const login = async (data) => {
  const res = await api.post("/login", data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.user.role); // fix here
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

// LOGOUT
export const logout = async () => {
  await api.post("/logout");
  localStorage.clear();
};

// CURRENT USER
export const getMe = () => api.get("/me");
