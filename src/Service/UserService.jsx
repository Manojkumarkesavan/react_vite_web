import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:8088";

  static register(userData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
      headers,
    });
  }

  static async login(userData) {
    return axios.post(`${UserService.BASE_URL}/auth/login`, userData);
  }

  static async search(query, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    console.log("Query being sent:", query); // Debugging: Check the query value
    console.log("token:", query); // Debugging: Check the query value

    return axios.get(`${this.BASE_URL}/users/search?query=${query.query}`, {
      headers,
    });
  }
}

export default UserService;
