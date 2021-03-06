import axios from 'axios'

export default class Http {
    constructor(){
        axios.interceptors.request.use((config:any):any => {
            config.headers['Cache-Control'] = 'no-cache'
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

    axiosHttpPostForm(url: any, params: any,config?: any ) {
        console.log(config)
        return new Promise((resolve, reject) => {
            axios.post(url, params, {
                headers:{ 'Content-Type':'multipart/form-data'},
                ...config
            }).then((res:any) => {
                resolve(res.data)
            }).catch((err:any) => {
                reject(err)
            })
        })
    }

    axiosHttpDelete(url:any) {
        return new Promise((resolve, reject) => {
            axios.delete(url).then((res:any) => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
        
    }
}