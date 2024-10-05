import axios from "axios";
import Cookies from "js-cookie";

interface RequestServiceProps {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    payload?: object;
    hasAttachment?: boolean
}

const apiInstance = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 10000
})

apiInstance.interceptors.request.use(config => {
    const token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const requestService = async ({
    url,
    method,
    payload,
    hasAttachment
}: RequestServiceProps) => {
    return apiInstance[method](url, payload, {
        headers: {
            'Content-Type': !hasAttachment ? 'application/json' : 'multipart/form-data'
        }
    })
}
