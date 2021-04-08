<template>
    <div class="uploadImg">
        <van-nav-bar
            title="图片上传"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
        />
        <div class="main">
            <div class="body">
                <div class="imgCtn" v-for="(item, index) in imgList" :key="index">
                    <img class="show-img" :src="item" alt="" srcset="" @click="showImgPreview(index)">
                </div>
                <div class="imgCtn-un" v-show="isLoading">
                    <div class="loading">
                        <van-loading type="spinner" color="#1989fa" size="50"/>
                    </div>
                </div>
                <div class="imgCtn-un">
                    <img src="../../../assets/icon/addImg.png" alt="" @click="showAlert = true">
                </div>
            </div>
            <div class="deleteImg" v-show="showDeleteArea">拖拽到此处删除图片</div>
        </div>
        <div v-if="showAlert">
            <van-popup v-model="showAlert" position="bottom">
                <div class="select">
                    <p>
                        拍照
                        <input type="file" accept="image/*" capture="camera" @change="selectFile">
                    </p>
                    <p>
                        相册
                        <input type="file" accept="image/*" mutiple @change="selectFile">
                    </p>
                    <p @click="showAlert = false">
                        取消
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
import { Vue,Component } from 'vue-property-decorator'
import { Compress } from '@/util/util'
@Component
export default class uploadImg extends Vue {
    private imgList:Array<any> = []
    private isLoading:boolean = false
    private showAlert:boolean = false
    private startPosition:number = 0
    private imgPreview:boolean = false
    private imgPrevIndex:number = 0
    private touchStartTime:any = null
    private firstPosition:any = {}
    private showDeleteArea:boolean = false

    activated(){
        this.imgList = []
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    showImgPreview(index:any){
        this.imgPrevIndex = index + 1
        this.startPosition = index
        this.imgPreview = true
    }

    selectFile(event:any){
        this.showAlert = false
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
                        setTimeout(() => {
                            this.addTouchEvent()   
                        });
                    })
                }
            }
        }
    }
    onChange(index:any) {
      this.imgPrevIndex = index+1;
    }
    addTouchEvent(){
        let domList:any = document.querySelectorAll('.show-img')
        if (domList) {
            let domMoveFlag:boolean = true
            domList.forEach((item:any,index:any) => {
                item.ontouchstart = null
                item.ontouchmove = null
                item.ontouchend = null
                item.ontouchstart = (startEvent:any) => {
                    startEvent.preventDefault()
                    console.log(startEvent)
                    this.touchStartTime = new Date()
                    setTimeout(() => {  
                        if (domMoveFlag) {     
                            console.log('执行元素位置操作过程')
                            this.showDeleteArea = true
                            let domClient:any = item.getBoundingClientRect()
                            console.log(domClient)
                            this.firstPosition = {
                                x:startEvent.changedTouches[0].pageX,
                                y:startEvent.changedTouches[0].pageY
                            }
                            item.style.position = 'fixed'
                            item.style.height = domClient.height + 'px'
                            item.style.width = domClient.width + 'px'
                            item.style.top = domClient.top + 'px'
                            item.style.left = domClient.left + 'px'
                            item.style.padding = 0
                            item.style.zIndex = 9
                            // 添加拖拽事件
                            item.ontouchmove = (moveEvent:any) => {
                                // console.log(moveEvent)
                                item.style.top = moveEvent.changedTouches[0].pageY - this.firstPosition.y + domClient.top + 'px'
                                item.style.left = moveEvent.changedTouches[0].pageX - this.firstPosition.x + domClient.left + 'px'
                            }                        
                        }          
                    }, 600);
                }
                item.ontouchend = (endEvent:any) => {
                    let time:any = new Date()
                    console.log(time - this.touchStartTime)
                    if (time - this.touchStartTime <= 400) {
                        domMoveFlag = false
                        item.click()
                        setTimeout(() => {
                            this.addTouchEvent()   
                        });
                    } else {
                        let newItemCenter:any = item.getBoundingClientRect()
                        let centerY:any = newItemCenter.top + newItemCenter.height / 2
                        let centerX:any = newItemCenter.left + newItemCenter.width / 2
                        let deleteDom:any = document.querySelector(".deleteImg")
                        let deleteArea:any = deleteDom.getBoundingClientRect()
                        if (centerY >= deleteArea.top) {
                            let _imgList = JSON.parse(JSON.stringify(this.imgList))
                            let currentImg:any = _imgList.splice(index,1)
                            this.imgList = []
                            this.showDeleteArea = false
                            setTimeout(() => {
                                this.imgList = _imgList
                                setTimeout(() => {
                                    this.addTouchEvent()   
                                });
                            });
                            return
                        }
                        this.showDeleteArea = false
                        // 计算所有图片元素所在页面位置
                        let domParentList:any = document.querySelectorAll('.imgCtn')
                        domParentList && domParentList.forEach((domParent:any,cindex:any) => {
                            let domPos:any = (domParent.getBoundingClientRect())
                            if ( 
                                centerY >= domPos.top 
                                && centerY <= domPos.bottom 
                                && centerX >= domPos.left
                                && centerX <= domPos.right
                            ) {
                                // 重新排序
                                console.log('在目标区域内，重新排序')
                                let _imgList = JSON.parse(JSON.stringify(this.imgList))
                                let currentImg:any = _imgList.splice(index,1)
                                _imgList.splice(cindex,0,...currentImg)
                                this.imgList = []
                                setTimeout(() => {
                                    this.imgList = _imgList
                                    setTimeout(() => {
                                        this.addTouchEvent()   
                                    });
                                });
                            }
                        });
                        // 还原样式
                        item.style.position = 'absolute';
                        item.style.height = '100%'
                        item.style.width = '100%'
                        item.style.top = '0'
                        item.style.left = '0'
                        item.style.padding = '10px'
                    }
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.uploadImg{
    height: 100%;
    width: 100%;
    .main{
        height: calc(100% - 40px);
        width: 100%;
        overflow: hidden;
        .body{
            padding: 16px;
            display: flex;
            flex-wrap: wrap;
        }
        .imgCtn,.imgCtn-un{
            width: 33.33%;
            height: 0;
            padding-top: 33.33%;
            position: relative;
            img{
                padding: 10px;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
            }
            .loading{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
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
    height: 80px;
    background-color: #f89696;
    width: 100%;
    text-align: center;
    line-height: 80px;
    color: #fff;
    font-size: 18px;
}
</style>