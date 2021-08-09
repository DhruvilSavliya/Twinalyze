import axios from "axios";
import api from "./api/api";

axios.defaults.baseURL = `http://csci5409group9-env.eba-wdps6qef.us-east-1.elasticbeanstalk.com/api`;

// axios.defaults.baseURL = `http://localhost:80/api`;

axios.interceptors.request.use(
  function (config) {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    };
    return { ...config, headers };
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const Routes = { api };

export default axios;
