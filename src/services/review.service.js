import axios from 'axios';
import authHeader from './auth-header';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "review/";
class ReviewService {
    postReview(title, subject, full_text) {
        return axios.post(API_URL + "add", {
            title,
            subject,
            full_text
        }, { headers: authHeader() })
    }
    getAllReviews() {
        return axios.get(API_URL + "all")
    }
    getReview(id) {
        return axios.get(API_URL + id)
    }
}
export default new ReviewService();
