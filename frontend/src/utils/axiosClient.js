import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://codemaster1-0.onrender.com || http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

