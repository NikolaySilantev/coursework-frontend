import axios from 'axios';
import authHeader from './auth-header';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "review/";
class ReviewService {
    addReview(author, title, subject, full_text, imageUrls, tags) {
        tags=tags.map((tag) => {
            return tag.text;
        })
        return axios.post(API_URL + "add/" + author, {
            title,
            subject,
            full_text,
            imageUrls,
            tags
        }, { headers: authHeader() })
    }

    editReview(title, subject, full_text, imageUrls, tags, id) {
        tags=tags.map((tag)=>{
            return tag.text;
        })
        return axios.post(API_URL + "edit", {
            title,
            subject,
            full_text,
            imageUrls,
            tags,
            id
        }, { headers: authHeader() })
    }
    getAllReviews() {
        return axios.get(API_URL + "all")
    }
    getReview(id) {
        return axios.get(API_URL + "details/" + id)
    }
    getReviewByTag(tag) {
        return axios.get(API_URL + "tag/" + tag)
    }

    searchReview(text) {
        return axios.get(API_URL + "search/" + text)
    }

    deleteReview(id) {
        return axios.delete(API_URL + "delete/" + id, { headers: authHeader() })
    }
}
export default new ReviewService();
