import axios, { CreateAxiosDefaults } from "axios";

const isHttps = true;
export const API_URL = isHttps ? "https://localhost:7013" : "http://localhost:5080";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  withCredentials: true,
};

export const axiosClassic = axios.create(axiosOptions);
