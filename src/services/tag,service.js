import axios from 'axios';
import authHeader from './auth-header';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "tag/";
class TagService {
    getAllTags() {
        return axios.get(API_URL + "all")
    }

}
export default new TagService();
