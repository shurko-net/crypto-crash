import { axiosClassic } from "./axios";

export const authApi = {
  getMe: async () => {
    const response = await axiosClassic.get("/api/auth/me");
    return response.data;
  },
  getNonce: async () => {
    const response = await axiosClassic.get("/api/auth/nonce");
    console.log(response.data);
    return response.data;
  },
  verify: async (message: string, signature: string) => {
    const response = await axiosClassic.post(
      "/api/auth/verify",
      { message, signature },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.status;
  },
  logout: async () => {
    await axiosClassic.post("/api/auth/logout");
  },
};
