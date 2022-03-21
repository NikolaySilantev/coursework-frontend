import axios from 'axios';
import {API_BASE_URL} from "../constants";

const API_URL = API_BASE_URL + "category/";
class CategoryService {
    getAllCategories() {
        return axios.get(API_URL + "all")
    }
}
export default new CategoryService();
