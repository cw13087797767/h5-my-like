<template>
    <div class="login-container">
        <p @click="toRegister()">注册新用户</p>
        <h1>练手项目</h1>
        <h5>Training project</h5>
        <section>
            <van-field 
                v-model="userNum" 
                label-width="50px" 
                left-icon="contact"
                placeholder="请输入账户"/>
            <van-field 
            v-model="userPwd" 
                :type="pwdType"
                placeholder="请输入密码"
                left-icon="notes-o" 
                :right-icon="pwdType == 'password' ? 'closed-eye':'eye-o'"
                @click-right-icon="rightClick(pwdType)"/>
            <p class="forget-pwd" @click="toReset()">忘记密码？</p>
            <van-button  type="info" 
                :disabled="userPwd && userNum ? false : true" 
                size="large"
                @click="login"> 登 录</van-button>
        </section>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {Mutation } from 'vuex-class';
import { userLogin } from '@/api/userApi'
@Component
export default class loginComponent extends Vue {
    @Mutation('set_globalLoading') set_globalLoading:any
    private pwdType:string = 'password'
    private userNum:string = ''
    private userPwd:string = ''

    rightClick(type:any){
        if (type == 'password') {
            this.pwdType = 'text'
        }else{
            this.pwdType = 'password'
        }
    }
    toRegister(){
        this.$router.push('/user/register')
    }
    toReset(){

    }
    login(){
        if (this.userNum && this.userPwd) {
            this.set_globalLoading(true)
            const params = {
                userAccount: this.userNum,
                password: this.userPwd
            }
            userLogin(params).then((res:any) => {
                if (res.code === '0') {
                    this.$toast("登陆成功！")
                    res.data.loginTime = new Date().valueOf()
                    window.localStorage.setItem('userConfig',JSON.stringify(res.data || {}))
                    setTimeout(() => {
                        this.$router.replace(`/home/main`)
                    }, 500);
                } else {
                    this.$toast(res.msg || '登陆失败，请稍后再试！')
                }
                this.set_globalLoading(false)
            }).catch(err => {
                this.$toast(err.msg || '登陆失败，请稍后再试！')
                this.set_globalLoading(false)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.login-container{
    height:100%;
    width:100%;
    background-image:url('../../assets/login.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    p{
        padding: 20px;
        text-align: right;
        color:#d0cfcf;
        font-size: 13px;
    }
    h1{
        text-align: center;
        color:#fff;
    }
    h5{
        text-align: center;
        color:#d0cfcf;;
        font-size: 12px;
        font-weight: 100;
    }
    section{
        width: 80%;
        padding-top: 50px;
        margin: auto;
        background-color: transparent;
        .forget-pwd{
            padding: 20px 0;
            font-size: 12px;
        }
    }
    /deep/.van-cell{
        background-color: transparent;
        color: #fff;
    }
    /deep/.van-field__control{
        color:#fff;
    }
    /deep/.van-field__left-icon {
        margin-right: 10px;
    }
    /deep/.van-button--large {
        width: 100%;
        height: 40px;
        line-height: 39px;
        margin-top: 20px;
    }
}
</style>

