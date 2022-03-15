import axios from 'axios';
import {CLOUDINARY_URL} from "../constants";

class ImageService {
    upload(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ofzcnspt")
        return axios.post(CLOUDINARY_URL , formData);
    }
    getImage(url) {
        return axios.get(url);
    }
}
export default new ImageService();