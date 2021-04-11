/**
 * 图片压缩
 * @param img 图片对象
 */
export function Compress(img:any,height:number,width:number,callback:Function) {
    let canvas:any = document.createElement('canvas')
    let context:any = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    context.clearRect(0,0,width,height)
    context.drawImage(img,0,0,width,height)
    callback(canvas.toDataURL("image/jpeg", 0.75))
}

/**
 * 退出登录
 */
export const loginOut = () => {
    window.localStorage.removeItem('userConfig')
    window.location.replace('/')
}

/**
 * base64转blob文件
 * @param base64 
 * @returns 
 */
export const base64ToBlob = (base64:any) => {
    const arr:Array<any> = base64.split(',')
    const fileType:any = arr[0].match(/:(.*?);/)[1]
    const bstr:any = atob(arr[1])
    let i:number = bstr.length
    const u8Arr:any = new Uint8Array(i)
    while (i--) {
        u8Arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8Arr], {
        type:fileType
    })
}

/**
 * blob转文件
 * @param blob 
 * @returns 
 */
export const blobToFile = (blob:any) => {
    blob.lastModifiedDate  = new Date()
    blob.name = new Date().valueOf().toString()
    return blob
}