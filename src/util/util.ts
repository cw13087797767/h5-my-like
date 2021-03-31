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