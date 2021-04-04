import axios from 'axios'

export default class Http {
    constructor(){
        axios.interceptors.request.use((config:any):any => {
            console.log(config)
            const userConfig = window.localStorage.getItem('userConfig')
            const unCheckUrlList:Array<any> = ['/mylike/api/user/login', '/mylike/api/user/register']
            if (unCheckUrlList.includes(config.url)) return config
            if (userConfig) {
                config.headers['userId'] = JSON.parse(userConfig).userId
            }
            return config
        }) 
    }

    axiosHttpGet(url: any) {
        return new Promise((resolve: any, reject: any) => {
            axios.get(url).then((res: any) => {
                resolve(res.data)
            }).catch((err: any) => {
                reject(err)
            })
        })
    }

    axiosHttpPost(url: any, params: any) {
        return new Promise((resolve: any, reject: any) => {
            axios.post(url, params).then((res: any) => {
                resolve(res.data)
            }).catch((err: any) => {
                reject(err)
            })
        })
    }

    axiosHttpPostForm(url: any, params: any) {
        return new Promise((resolve, reject) => {
            axios.post(url, params, {
                headers:{ 'Content-Type':'multipart/form-data'}
            }).then((res:any) => {
                resolve(res.data)
            }).catch((err:any) => {
                reject(err)
            })
        })
        
    }
}