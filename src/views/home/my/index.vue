<template>
    <div class="home">
        <van-nav-bar 
            class="nav-title"
            :title="headerModule.headerText"
        />
        <div class="top">
            <div class="top-center">
                <div class="img-ctn">
                    <img :src="require(`@/assets/yu_tou.png`)" alt="" srcset="">
                </div>
                <p class="lv">LV:<span>66</span></p>
            </div>
            <div class="top-footer"></div>
            <div class="username">
                <span>吴彦祖</span>
            </div>
        </div>
        <div class="mid">
            <p>修改信息</p>
            <p @click="showLogOut">退出登录</p>
        </div>
        <!-- <input type="button" value="显示弹窗" @click="handleAlert(true)">
        <div class="alert" v-if="alertFlag"  @click="handleAlert(false)"></div> -->
    </div>
</template>

<script lang="ts">
import {Vue,Component} from 'vue-property-decorator';
import { State,Mutation } from 'vuex-class';
import { loginOut } from '@/util/util'
import homeApi from '@/api/homeApi'
import { Dialog } from 'vant'

@Component
export default class MyComponent extends Vue {
    @State('headerModule') headerModule:any
    @Mutation('set_headerText') set_headerText:any;

    private alertFlag:boolean = false
    activated() {
        this.set_headerText('我的')
    }
    
    mounted(){
        window.onhashchange = () =>{
            if (this.alertFlag) {
                 this.handleAlert(false)
            }
        }
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
                    height: auto;
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
</style>