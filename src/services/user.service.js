import axios from 'axios';
import authHeader from './auth-header';
import {API_BASE_URL} from "../constants";
const API_URL = API_BASE_URL + "test/";
const API_URL_USER = API_BASE_URL + "user/";
class UserService {
    getAllUsers() {
        return axios.get(API_URL_USER + 'all', { headers: authHeader() });
    }
    blockUsers(ids) {
        return axios.post(API_URL_USER + 'block', ids, { headers: authHeader() });
    }
    unblockUsers(ids) {
        return axios.post(API_URL_USER + 'unblock', ids, { headers: authHeader() });
    }
    deleteUsers(ids) {
        return axios.post(API_URL_USER + 'delete', ids, { headers: authHeader() });
    }
    makeAdminUsers(ids) {
        return axios.post(API_URL_USER + 'admin', ids, { headers: authHeader() });
    }
    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
    getModeratorBoard() {
        return axios.get(API_URL + 'mod', { headers: authHeader() });
    }
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }
    getProfile(name) {
        return axios.get(API_URL_USER + name)
    }
}
export default new UserService();
