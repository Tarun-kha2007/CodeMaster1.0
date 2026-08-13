import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://code-master1-0.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

