import axios from 'axios';
import authHeader from './auth-header';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "rating/";
class RatingService {
    likeReview(userId, reviewId) {
        return axios.post(API_URL + "like", {
            userId,
            reviewId
        }, { headers: authHeader() })
    }
}
export default new RatingService();
