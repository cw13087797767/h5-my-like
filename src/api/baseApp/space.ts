import http from '../http'
const Http = new http()

// 新增日记
export const spaceInsert = (params:any, config?:any) => Http.axiosHttpPostForm(`/mylike/api/baseApp/space/insert`,params, config)

// 日记列表
export const spaceList = (params:any) => Http.axiosHttpGet(`/mylike/api/baseApp/space/list?pageSize=10&pageNum=${params}`)

// 日记详情
export const spaceDetail = (params:any) => Http.axiosHttpGet(`/mylike/api/baseApp/space/detail?id=${params.id}&userId=${params.userId}`)

// 删除日记
export const spaceDelete = (params:any) => Http.axiosHttpDelete(`/mylike/api/baseApp/space/delete?id=${params}`)