<template>
    <div class="ctn">
        <van-nav-bar
            title="发布日记"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
            @click-right="onClickRight"
        >
            <template #right>
                <span>发布</span>
            </template>
        </van-nav-bar>
        <div class="body">
            <textarea 
                class="textarea" 
                placeholder="说点什么吧" 
                cols="30" 
                rows="3"
                v-model="content"
            ></textarea>
            <p><van-checkbox v-model="checked">记录当前位置信息</van-checkbox></p>
            <div class="imgCtn">
                <div class="imgBody" v-for="(item, index) in imgList" :key="index">
                    <div 
                        class="img" 
                        :style="`background-image: url(${item})`" 
                        @click="showImgPreview(index)"
                    ></div>
                </div>
                <div class="imgBody_un" v-if="imgList.length < 9">
                    <div class="imgloading" v-if="isLoading">
                        <van-loading type="spinner" color="#1989fa" size="50"/>
                    </div>
                    <img 
                        v-else 
                        src="../../../../assets/icon/addImg.png" 
                        alt="" 
                        srcset=""
                        @click="showVisible"
                    >
                </div>
            </div>
            <div class="deleteImg" v-show="showDeleteArea">拖拽到此处删除图片</div>
            <div class="uploading" v-if="uploading">
                <van-circle 
                    v-model="progress" 
                    :rate="0"
                    :speed="100" 
                    size="150"
                    :color="{
                        '0%': '#3fecff',
                        '100%': '#6149f6',
                    }"
                >
                    <div class="upload-text">上传中。。。</div>
                </van-circle>
            </div>
        </div>
        <div v-if="visible">
            <van-popup v-model="visible" position="bottom">
                <div class="select">
                    <p>
                        拍照
                        <input type="file" accept="image/*" capture="camera" @change="selectFile">
                    </p>
                    <p>
                        相册
                        <input type="file" accept="image/*" mutiple @change="selectFile">
                    </p>
                </div>
            </van-popup>
        </div>
        <van-image-preview 
            v-model="imgPreview" 
            :images="imgList" 
            @change="onChange"
            :startPosition="startPosition"
        >
            <template v-slot:imgPrevIndex>{{ imgPrevIndex }}</template>
        </van-image-preview>
        
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Compress, base64ToBlob, blobToFile } from '@/util/util'
import { spaceInsert } from '@/api/baseApp/space'

@Component
export default class EditSpace extends Vue {

    private imgList:Array<any> = []
    private visible:boolean = false
    private isLoading:boolean = false
    private startPosition:number = 0
    private imgPreview:boolean = false
    private firstPosition:any = null
    private imgPrevIndex:number = 0
    private touchStartTime:any = null
    private showDeleteArea:boolean = false
    private content:any = ''
    private checked:boolean = true
    private progress:number = 0
    private uploading:boolean = false

    activated() {
        this.imgList = []
        this.visible = false
        this.isLoading = false
        this.startPosition = 0
        this.imgPreview = false
        this.firstPosition = null
        this.imgPrevIndex = 0
        this.touchStartTime = null
        this.showDeleteArea = false
        this.content = ''
        this.checked = true
        this.progress = 0
        this.uploading = false
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    async onClickRight(){
        if (!this.content && this.imgList.length === 0) {
            this.$toast("说点什么再发布吧")
            return
        }
        this.uploading = true
        let address = '', lng = '', lat = ''
        if (this.checked) {
            const locationObj:any = await this.getLocation()
            address = locationObj.address
            lng = locationObj.lng
            lat = locationObj.lat
        }
        const formData = new FormData()
        formData.append('content', this.content)
        formData.append('address', address)
        formData.append('lng', lng)
        formData.append('lat', lat)
        this.imgList.map((item, index) => {
            formData.append(`file${index}`, blobToFile(base64ToBlob(item)))
        })
        spaceInsert(formData,{
            onUploadProgress: (progressEvent:any) => {
                console.log(progressEvent)
                this.progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
             }
        }).then((res:any) => {
            if (res && res.code === '0') {
                this.$toast('新增成功')
                setTimeout(() => {
                    this.$router.go(-1)
                },500);
            } else {
                this.$toast(res && res.msg ? res.msg : '新增失败')
            }
        }).catch(err => {
            this.$toast('新增失败')
        }).finally(() => {
            this.progress = 0
            this.uploading = false
        })
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            const geolocation  = new window.BMap.Geolocation()
            geolocation .getCurrentPosition((res:any) => {
                let address = '', lng = '', lat = ''
                if (res) {
                    if (res.address) {
                        const resAdr = res.address
                        address += (resAdr.province || '') + (resAdr.city || '') + (resAdr.district || '') + (resAdr.street || '')
                    }
                    if (res.point) {
                        lng = res.point.lng || ''
                        lat = res.point.lat || ''
                    }
                }
                resolve({
                    address,
                    lng,
                    lat
                })
            },{
                enableHighAccuracy: true,
                timeout:3000,
                SDKLocation:true
            })
        })
        
    }

    showVisible(){
        this.visible = true
    }

    onChange(index:any) {
      this.imgPrevIndex = index+1;
    }

    showImgPreview(index:any){
        this.imgPrevIndex = index + 1
        this.startPosition = index
        this.imgPreview = true
    }

    selectFile(event:any){
        this.visible = false
        if (event.target.files && event.target.files.length > 0) {
            this.isLoading = true
            let file:any = event.target.files[0]
            let fr:any = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = (imgObj:any) => {
                let img:any = new Image()
                img.src = imgObj.target.result
                img.onload = (e:any) => {
                    Compress(img,e.path[0].height,e.path[0].width,(newImg:any) => {
                        this.imgList.push(newImg)
                        this.isLoading = false
                        this.$nextTick(() => {
                            this.addTouchEvent()   
                        })
                    })
                }
            }
        }
    }

    addTouchEvent(){
        let domList:any = document.querySelectorAll('.img')
        if (domList) {
            let domMoveFlag:boolean = true
            domList.forEach((item:any,index:any) => {
                item.ontouchstart = null
                item.ontouchmove = null
                item.ontouchend = null
                item.ontouchstart = (startEvent:any) => {
                    startEvent.preventDefault()
                    this.touchStartTime = new Date()
                    setTimeout(() => {  
                        if (domMoveFlag) {
                            console.log('执行元素位置操作过程')
                            this.showDeleteArea = true
                            let domClient:any = item.getBoundingClientRect()
                            this.firstPosition = {
                                x:startEvent.changedTouches[0].pageX,
                                y:startEvent.changedTouches[0].pageY
                            }
                            // item.style.position = 'fixed'
                            // item.style.height = domClient.height + 'px'
                            // item.style.width = domClient.width + 'px'
                            // item.style.top = domClient.top + 'px'
                            // item.style.left = domClient.left + 'px'
                            item.style.border = 'none'
                            item.style.zIndex = 9
                            item.style.transition = 'none'
                            // 添加拖拽事件
                            item.ontouchmove = (moveEvent:any) => {
                                // item.style.top = moveEvent.changedTouches[0].pageY - this.firstPosition.y + domClient.top + 'px'
                                // item.style.left = moveEvent.changedTouches[0].pageX - this.firstPosition.x + domClient.left + 'px'
                                item.style.top = moveEvent.changedTouches[0].pageY - domClient.top - (this.firstPosition.y - domClient.top) + 'px'
                                item.style.left = moveEvent.changedTouches[0].pageX - domClient.left - (this.firstPosition.x - domClient.left) + 'px'
                            }                        
                        }          
                    }, 600);
                }
                item.ontouchend = (endEvent:any) => {
                    let time:any = new Date()
                    // touch事件小于400ms，认为是点击事件
                    if (time - this.touchStartTime <= 400) {
                        domMoveFlag = false
                        item.click()
                        this.addTouchEvent()   
                    } else {
                        let newItemCenter:any = item.getBoundingClientRect()
                        let centerY:any = newItemCenter.top + newItemCenter.height / 2
                        let centerX:any = newItemCenter.left + newItemCenter.width / 2
                        let deleteDom:any = document.querySelector(".deleteImg")
                        let deleteArea:any = deleteDom.getBoundingClientRect()
                        this.showDeleteArea = false
                        // 还原样式
                        item.style.top = '0'
                        item.style.left = '0'
                        // item.style.position = 'absolute';
                        // item.style.height = '100%'
                        // item.style.width = '100%'
                        item.style.border = 'solid 5px #fff'
                        item.style.zIndex = '1'
                        item.style.transition = 'all ease 0.5s'
                        // 删除操作
                        if (centerY >= deleteArea.top) {
                            let _imgList = [...this.imgList]
                            _imgList.splice(index,1)
                            this.imgList = []
                            this.imgList = _imgList
                            this.$nextTick(() => {
                                this.addTouchEvent()
                            })
                            return
                        }
                        // 计算所有图片元素所在页面位置
                        let domParentList:any = document.querySelectorAll('.imgBody')
                        domParentList && domParentList.forEach((domParent:any,cindex:any) => {
                            let domPos:any = domParent.getBoundingClientRect()
                            if ( 
                                centerY >= domPos.top 
                                && centerY <= domPos.bottom 
                                && centerX >= domPos.left
                                && centerX <= domPos.right
                            ) {
                                // 重新排序
                                console.log('在目标区域内，重新排序')
                                let _imgList = [...this.imgList]
                                let currentImg:any = _imgList.splice(index,1)
                                _imgList.splice(cindex,0,...currentImg)
                                this.imgList = []
                                this.imgList = _imgList
                            }
                        });
                        this.$nextTick(() => {
                            this.addTouchEvent()
                        })
                    }
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .ctn{
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        overflow: hidden;
        .body{
            flex: 1;
            padding: 20px;
            position: relative;
            .textarea{
                width: 100%;
                outline: none;
                border: none;
                resize: none;
                line-height: 35px;
                font-size: 15px;
                letter-spacing: 1px;
                color: #666666;
                margin-bottom: 20px;
            }
            .imgCtn{
                display: flex;
                width: 100%;
                flex-wrap: wrap;
                .imgBody{
                    width: 33.33%;
                    height: 0;
                    position: relative;
                    padding-bottom: 33.33%;
                    .img{
                        position: absolute;
                        height: 100%;
                        width: 100%;
                        top: 0;
                        left: 0;
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        border: solid 5px #fff;
                        box-sizing: border-box;
                        border-radius: 10px;
                        transition: all ease 0.5s;
                    }
                }
                .imgBody_un{
                    width: 33.33%;
                    height: 0;
                    position: relative;
                    padding-bottom: 33.33%;
                    img{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        padding: 5px;
                        box-sizing: border-box;
                        border-radius: 10px;
                    }
                }
            }
        }
    }
.select{
    width: 100%;
    bottom: 0;
    left: 0;
    p{
        line-height: 44px;
        font-size: 16px;
        text-align: center;
        border-bottom: solid 1px #eaeaea;
        position: relative;
        input{
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            opacity: 0;
            z-index: 1;
        }
    }
}
.deleteImg{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 60px;
    background-color: #f89696;
    width: 100%;
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-size: 18px;
}
.imgloading{
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.uploading{
    position: absolute;
    z-index: 99;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.upload-text{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}
</style>