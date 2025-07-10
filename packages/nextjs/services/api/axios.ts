import axios, { CreateAxiosDefaults } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  withCredentials: true,
};

export const axiosClassic = axios.create(axiosOptions);
