import Http from './http'

const http = new Http()

// 注册用户
export const registerUser = (params: any) => {
    return http.axiosHttpPost(`/mylike/api/user/register`, params)
}

export const userTest = () => {
    return http.axiosHttpGet(`/mylike/api/user/test`)
}