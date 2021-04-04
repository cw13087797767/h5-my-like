<template>
    <div class="home">
        <van-nav-bar 
            class="nav-title"
            :title="headerModule.headerText"
        />
        <div class="top">
            <div class="top-center">
                <div class="img-ctn" @click="handleAlert(true)">
                    <img :src="userDetail.userImg || require(`@/assets/yu_tou.png`)" alt="" srcset="">
                </div>
                <p class="lv">LV:<span>{{ userDetail.gradePoint }}</span></p>
            </div>
            <div class="top-footer"></div>
            <div class="username">
                <span>{{userDetail.userName}}</span>
            </div>
        </div>
        <div class="mid">
            <p>修改信息</p>
            <p @click="showLogOut">退出登录</p>
        </div>
        <van-popup v-model="alertFlag" position="bottom" @click-overlay="handleAlert(false)">
            <div class="showBottom">
                <p class="input-ctn">
                    <span>拍照</span>
                    <input type="file" accept="image/*" mutiple capture="camera" @change="selectFile">
                </p>
                <p class="input-ctn">
                    <span>图库选择</span>
                    <input type="file" accept="image/*" mutiple @change="selectFile">
                </p>
                <p @click="handleAlert(false)">取消</p>
            </div>
        </van-popup>
        <van-popup v-model="showImgFlag"  position="right" :style="{ height: '100%', width: '100%' }">
            <div class="fullModal">
                <div class="showImg">
                    <img :src="showImg" alt="" srcset="">
                </div>
                <div class="chooseCtn">
                    <van-icon 
                        name="cross" 
                        color="#e4a2a2"
                        size="30"
                        style="padding: 5px;border-radius: 50%;border: 1px solid #e4a2a2;color: #e4a2a2;" 
                        @click="showImgFlag = false"
                    />
                    <van-icon 
                        name="success" 
                        color="#1fce35"
                        size="30"
                        style="padding: 5px;border-radius: 50%;border: 1px solid #1fce35;color: #1fce35;" 
                        @click="uploadImg"
                    />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script lang="ts">
import {Vue,Component} from 'vue-property-decorator';
import { State,Mutation } from 'vuex-class';
import { loginOut } from '@/util/util'
import { updateUserImg, userLogin, getUserDetailById } from '@/api/userApi'
import { Dialog } from 'vant'
import { Compress } from '@/util/util'

@Component
export default class MyComponent extends Vue {
    @State('headerModule') headerModule:any
    @Mutation('set_headerText') set_headerText:any;

    private userDetail:any = {}
    private alertFlag:boolean = false
    private isLoading:boolean = false
    private showImgFlag:boolean = false
    private showImg:any = null
    private file:any = null

    activated() {
        this.set_headerText('我的')
        this.getUserDetail()
    }

    
    mounted(){
        window.onhashchange = () =>{
            if (this.alertFlag) {
                this.handleAlert(false)
            }
        }
    }

    getUserDetail(){
        const userConfig:any = window.localStorage.getItem('userConfig')
        if (userConfig) {
            getUserDetailById({}).then((res:any) => {
                if (res && res.code === '0') {
                    this.userDetail = res.data || {}
                } else {
                    this.$toast(res.msg || '获取用户信息失败')
                }
            }).catch(err => {
                this.$toast(err || '获取用户信息失败')
            })
        }
    }

    selectFile(event:any){
        if (event.target.files && event.target.files.length > 0) {
            this.isLoading = true
            let file:any = event.target.files[0]
            this.file = file
            let fr:any = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = (imgObj:any) => {
                let img:any = new Image()
                img.src = imgObj.target.result
                img.onload = (e:any) => {
                    Compress(img,e.path[0].height,e.path[0].width,(newImg:any) => {
                        this.showImg = newImg
                        this.showImgFlag = true
                        this.isLoading = false
                    })
                }
            }
        }
    }

    uploadImg(){
        const form = new FormData()
        form.append('file',this.file)
        updateUserImg(form).then((res:any) => {
            console.log(res)
            if (res && res.code === '0') {
                this.$toast("更新头像成功!")
                this.getUserDetail()
                this.handleAlert(false)
                this.showImg = null
                this.showImgFlag = false
                this.file = null
            } else {
                this.$toast(res.message || "更新头像成功!")
            }
        })
    }

    showLogOut(){
        Dialog.alert({
            message: '确认要退出登录吗？',
            showCancelButton:true
        }).then(() => {
            loginOut()
        });
    }

    handleAlert(flag:any) {
        this.alertFlag = flag
        if (flag) {
            window.history.pushState(null,'',location.href + '&showFlag')
        }else{
            if (location.href.indexOf("&showFlag") > -1) {
                window.history.back()
            }
        }
    }

}
</script>

<style lang="less" scoped>
.alert{
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 9;
}
.home{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .top{
        height: 270px;
        position: relative;
        background: linear-gradient(to right, #4981ec, #10b7ff);
        .top-center{
            height: 200px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .img-ctn{
                height: 100px;
                width: 100px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width: 100%;
                    border-radius: 50%;
                    height: 100%;
                }
            }
            .lv{
                line-height: 50px;
                color: #fff;
                font-size: 16px;
                span{
                    color: #ffd01e;
                    font-size: 18px;
                    font-weight: bolder;
                    padding-left: 5px;
                }
            }
        }
        .top-footer{
            height: 70px;
            width: 100%;
            background-color: #fff;
            border-radius: 75% 75% 0 0;
        }
        .username{
            position: absolute;
            right: 0;
            top: 10px;
            padding: 5px 20px 5px 10px;
            border: solid 1px #eaeaea;
            border-right: none;
            border-radius: 20px 0 0 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffd01e;
        }
    }
    .mid{
        width: calc(100% - 20px);
        overflow: hidden;
        border-radius: 10px;
        margin: auto;
        border: solid 1px #eaeaea;
        p{
            line-height: 40px;
            color: #666666;
            font-size: 16px;
            border-top: solid 1px #f7f6f6;
            padding-left: 50px;
        }
    }
}
.showBottom{
    width: 100%;
    text-align: center;
    line-height: 40px;
    overflow: hidden;
    p{
        text-align: center;
        border-bottom: solid 1px #f7f6f6;
    }
    .input-ctn{
        position: relative;
        input{
            position: absolute;
            height: 100%;
            width: 100%;
            opacity: 0;
            z-index: 2;
            left: 0;
            top: 0;
        }
    }
}
.fullModal{
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .showImg{
        width: 40%;
        margin-top: 30%;
        position: relative;
        padding-bottom: 40%;
        img{
            height: 100%;
            width: 100%;
            position: absolute;
            border-radius: 50%;
        }
    }
    .chooseCtn{
        position: absolute;
        bottom: 10%;
        width: 50%;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>