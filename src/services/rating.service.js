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
    rateReviewSubject(userId, reviewId, score) {
        return axios.post(API_URL + "rate", {
            userId,
            reviewId,
            score
        }, { headers: authHeader() })
    }

    getUserRating(userId, reviewId) {
        return axios.get(API_URL + "user-score", {params: {reviewId: reviewId, userId: userId}})
    }

    getUserLike(userId, reviewId) {
        return axios.get(API_URL + "user-like", {params: {reviewId: reviewId, userId: userId}})
    }
}
export default new RatingService();
