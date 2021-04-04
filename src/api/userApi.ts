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

// 上传头像
export const updateUserImg = (params:any) => {
    return http.axiosHttpPostForm(`/mylike/api/user/updateUserImg`, params)
}

// 用户登录
export const getUserDetailById = (params: any) => {
    return http.axiosHttpPost(`/mylike/api/user/userDetail`, params)
}
