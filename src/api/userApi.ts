import Http from './http'

const http = new Http()

// 注册用户
export const userRegister = (params: any) => {
    return http.axiosHttpPost(`/mylike/api/user/register`, params)
}

// 用户登录
export const userLogin = (params: any) => {
    return http.axiosHttpPost(`/mylike/api/user/login`, params)
}