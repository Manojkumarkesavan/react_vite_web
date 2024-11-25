import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:8088"; // Ensure this matches your backend

  static register(userData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.post(`${this.BASE_URL}/auth/register`, userData, {
      headers,
    });
  }

  static async login(userData) {
    return axios.post(`${this.BASE_URL}/auth/login`, userData);
  }

  static async search(query, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return axios.get(
      `${this.BASE_URL}/users/search?query=${encodeURIComponent(query.query)}`,
      {
        headers,
      },
    );
  }

  static async getConversation(userId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return axios.get(`${this.BASE_URL}/api/conversations/${userId}`, {
      headers,
    });
  }

  static async fetchMessages(conversationId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return axios.get(
      `${this.BASE_URL}/api/conversations/${conversationId}/messages`,
      {
        headers,
      },
    );
  }

  static async startConversation(currentUserId, userId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const body = {
      user1: currentUserId,
      user2: userId,
    };
    return axios.post(`${this.BASE_URL}/api/conversations`, body, {
      headers: headers,
    });
  }

  static async sendMessage(newMessage, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.post(`${this.BASE_URL}/api/messages`, newMessage, {
      headers,
    });
  }

  static async getUserById(userId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.get(`${this.BASE_URL}/users/${userId}`, {
      headers,
    });
  }
}

export default UserService;
