import axios from 'axios';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "tag/";
class TagService {
    getAllTags() {
        return axios.get(API_URL + "all")
    }

    getTopTags() {
        return axios.get(API_URL + "top")
    }
}
export default new TagService();
