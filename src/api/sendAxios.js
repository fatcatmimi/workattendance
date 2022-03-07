import axios from 'axios'
import Qs from 'qs'
import { message } from 'antd'

axios.defaults.withCredentials = true;

export const Base = 'http://192.168.82.215/webNerve/modules/itservice/CostsAnalytics/liwenyan/'

export const sendAxios = (url, params = {}, method = 'GET') => {
    return new Promise((resolve) => {
        let promise;
        if (method === 'GET') {
            promise = axios.get(url, {
                params
            })
        } else if (method === 'POST') {
            promise = axios.post(url, Qs.stringify(params))
        }

        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error(error.message)
        })
    })
}