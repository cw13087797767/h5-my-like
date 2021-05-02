import Http from './http'

const http = new Http()

// 获取歌曲列表
export const getMusicList = (params:any) => {
    return http.axiosHttpGet(`/mylike/api/music/list?keywords=${params}`)
}

export const getMusicUrl = (params:any) => {
    return http.axiosHttpGet(`/mylike/api/music/url?id=${params}`)
}