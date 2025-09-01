import axios from "axios";

// baseURL = "" để axios dùng đường dẫn tương đối => FE (5173) proxy '/api/payments' sang 8081
export const paymentApi = axios.create({ baseURL: "" });
