import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Access-Control-Allow-Origin": "*" },
});

const error = (error: AxiosError) => {
  return Promise.reject(error);
};

// const { accessToken } = useAuthStore();
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXN0ZXIiLCJzY29wZXMiOlsidXNlciIsImFkbWluIl0sImV4cCI6MTY3MTU0ODM3MTM5Ni45OTd9.6xd18_vbdVxoaismDh5ZkbpkQ2i9RR81pfJRIcaFIsg";

http.interceptors.request.use((config) => {
  const contentType = config.headers && config.headers["Content-Type"];
  config.headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentType || "application/json",
    "Access-Control-Allow-Methods": "POST, PATCH, GET, OPTIONS, PUT, DELETE",
    Authorization: `bearer ${accessToken}`,
  };

  return config;
}, error);

http.interceptors.response.use(({ data }) => {
  return data;
}, error);

export default http;
