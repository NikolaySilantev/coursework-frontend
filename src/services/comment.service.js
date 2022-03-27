import axios from 'axios';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "comment/";

class CommentService {
    getAllComments(reviewId) {
        return axios.get(API_URL + reviewId + "/all")
    }
}

export default new CommentService();
