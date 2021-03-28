<template>
    <div class="register-container">
        <van-nav-bar title="注册新用户" >
            <van-icon name="arrow-left" slot="left" @click="goback"/>
        </van-nav-bar>
        <div class="register-body">
            <van-field
                v-model="username"
                required
                label="用户名"
                :error-message="errorMessage.username"
                @blur="testInput('username')"
                placeholder="请输入用户名"/>
            <van-field
                v-model="userpwd"
                required
                type="password"
                @blur="testInput('userpwd')"
                :error-message="errorMessage.userpwd"
                label="设置密码"
                placeholder="请输入密码"/>
            <van-field
                v-model="userpwdRe"
                required
                type="password"
                @blur="testInput('userpwdRe')"
                :error-message="errorMessage.userpwdRe"
                label="确认密码"
                placeholder="请再次输入密码"/>
            <van-field
                v-model="name"
                required
                @blur="testInput('name')"
                :error-message="errorMessage.name"
                label="昵称"
                placeholder="请输入昵称"/>
            <van-field
                v-model="phone"
                required
                label="手机"
                @blur="testInput('phone')"
                :error-message="errorMessage.phone"
                type="tel"
                placeholder="请输入手机"/>
            <van-field
                v-model="email"
                required
                @blur="testInput('email')"
                :error-message="errorMessage.email"
                label="邮箱"
                placeholder="请输入邮箱"/>
            <van-field
                v-model="Invitation"
                label="邀请码"
                placeholder="请输入邀请码（选填）"/>
            <van-button type="info" size="large" @click="register">马上注册</van-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import { registerUser } from '@/api/userApi'
@Component
export default class registerComponent extends Vue{
    private username:string = ""
    private userpwd:string = ""
    private userpwdRe:string = ""
    private name:string = ""
    private phone:string = ""
    private email:string = ""
    private Invitation:string = ""
    private errorMessage:any = {}

    register(){
        if (!this.testInput('username')) {
            return
        }
        if (!this.testInput('userpwd')) {
            return
        }
        if (!this.testInput('userpwdRe')) {
            return
        }
        if (!this.testInput('name')) {
            return
        }
        if (!this.testInput('phone')) {
            return
        }
        if (!this.testInput('email')) {
            return
        }
        const params = {
            userAccount:this.username,
            password:this.userpwd,
            userName:this.name,
            phone:this.phone,
            email:this.email,
            invitation:this.Invitation,
            userImg:null
        }
        registerUser(params).then((res:any) => {
            if (res && res.code === '0') {
                this.$toast('注册成功！')
                setTimeout(() => {
                    this.$router.go(-1)
                }, 500);
            } else {
                this.$toast(res.msg || '注册成功！')
            }
        }).catch(err => {
            this.$toast('注册失败，请稍后再试！')
        })
    }

    testInput(text:any){
        if (text == 'username') {
            if (!this.username 
                || !this.haveZH(this.username) 
                || this.username.length < 6 
                || this.username.length > 16) {
                this.$set(this.errorMessage,text,'用户名6-16位，不能包含中文')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'userpwd') {
            if (!this.userpwd 
                || !this.haveZH(this.userpwd) 
                || this.userpwd.length < 6 
                || this.userpwd.length > 16) {
                this.$set(this.errorMessage,text,'密码6-16位，不能包含中文')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'userpwdRe') {
            if (!this.userpwdRe 
                || !this.haveZH(this.userpwdRe) 
                || this.userpwdRe.length < 6 
                || this.userpwdRe.length > 16) {
                this.$set(this.errorMessage,text,'密码6-16位，不能包含中文')
                return false
            }else if(this.userpwdRe != this.userpwd){
                this.$set(this.errorMessage,text,'两次密码输入不一致')
                return false
            }else {
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'name') {
            if (!this.name) {
                this.$set(this.errorMessage,text,'请输入用户名')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'phone') {
            if (!this.phone 
                || !(/^1[3456789]\d{9}$/.test(this.phone))) {
                this.$set(this.errorMessage,text,'请输入正确的电话号码')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'email') {
            if (!this.email 
                || !(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.email))) {
                this.$set(this.errorMessage,text,'请输入正确的邮件')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }
    }

    goback(){
        this.$router.go(-1)
    }

    haveZH(text:any){
        let regx = /.*[\u4e00-\u9fa5]+.*$/;
        if (regx.test(text)) {
            return false
        }else{
            return true
        }
    }
}
</script>

<style lang="less" scoped>
    .register-container{
        height:100%;
        width:100%;
        background-image: url("../../assets/bgimg-bottom.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    /deep/.van-nav-bar{
        height: 40px;
        background-image:  linear-gradient(to right ,#4981ec, #10b7ff);
        color:#fff;
        line-height: 40px;
    }
    /deep/.van-nav-bar .van-icon {
        color: #fff;
        vertical-align: middle;
    }
    /deep/.van-nav-bar__title{
        color: #fff;
    }
    .register-body{
        padding: 5px 10px;
    }
    /deep/.van-button--large {
        width: 100%;
        height: 40px;
        line-height: 39px;
        margin-top: 20px;
    }

</style>

