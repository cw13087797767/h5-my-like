import Http from './http'

const http = new Http()

/**
 * 请求区域矢量数据
 * @param url 
 */
function getResourceData(url:any) {
    return http.axiosHttpGet(url)
}

function getGridChartData(time:any){
    let url = `/h5-my-like/api/home/grid/chart?time=${time}`
    return http.axiosHttpGet(url)
}

export default {
    getResourceData,
    getGridChartData,
}