import axios, { CreateAxiosDefaults } from "axios";

export const API_URL = "https://crypto-crush-api.duckdns.org";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  withCredentials: true,
};

export const axiosClassic = axios.create(axiosOptions);
