// import { API_URL } from "../services/auth.service";
export const API_URL = "http://marketplace.diycam.com/api/v1/";
const axios = require("axios");
export const axiosApiInstance = axios.create();
export const axiosPostMediaInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    config.baseURL = API_URL;
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
      Accept: "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();

      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      // const value = JSON.parse(localStorage.getItem("user"));
      // value.access_token = access_token;
      localStorage.setItem("accessToken", access_token);

      return axiosApiInstance(originalRequest);
    }
    console.log("error");
    console.log(error);
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  console.log("REFRESHING");
  try {
    const data = await axios.post(API_URL + "users/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    return data.data.accessToken;
  } catch (error) {
    console.log("REFERSH TOKEN EXPIRED");
    // window.location.href = "/";
    // alert("token expired");
    localStorage.clear();
  }
}

// Request interceptor for API calls
axiosPostMediaInstance.interceptors.request.use(
  async (config) => {
    const value = JSON.parse(localStorage.getItem("user"));
    const keys = value.access_token;
    config.baseURL = API_URL;
    config.headers = {
      Authorization: `Bearer ${keys}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };
    return config;
  },
  (error) => {
    localStorage.clear();
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosPostMediaInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();

      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      const value = JSON.parse(localStorage.getItem("user"));
      value.access_token = access_token;
      localStorage.setItem("user", JSON.stringify(value));

      return axiosPostMediaInstance(originalRequest);
    }
    console.log("error");
    console.log(error);
    return Promise.reject(error);
  }
);
