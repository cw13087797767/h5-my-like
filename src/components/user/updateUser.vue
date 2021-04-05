<template>
    <div>
        <van-nav-bar class="nav-title" title="修改个人信息">
            <van-icon name="arrow-left" slot="left" @click="goback"/>
        </van-nav-bar>
        <div class="updateBody">
            <van-field
                v-model="userDetail.userName"
                required
                @blur="testInput('userName')"
                :error-message="errorMessage.userName"
                label="昵称"
                placeholder="请输入昵称"/>
            <van-field
                v-model="userDetail.phone"
                required
                label="手机"
                @blur="testInput('phone')"
                :error-message="errorMessage.phone"
                type="tel"
                placeholder="请输入手机"/>
            <van-field
                v-model="userDetail.email"
                required
                @blur="testInput('email')"
                :error-message="errorMessage.email"
                label="邮箱"
                placeholder="请输入邮箱"/>
            <van-button style="margin-top:20px" type="info" size="large" @click="update">确&nbsp;认</van-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getUserDetailById, updateUserInfo } from '@/api/userApi'
import { Dialog } from 'vant'

@Component
export default class UpdateUser extends Vue {
    private userDetail:any = {}
    private errorMessage:any = {}

    activated(){
        this.getUserDetail()
    }

    update(){
        if (!this.testInput('userName')) return
        if (!this.testInput('phone')) return
        if (!this.testInput('email')) return
        Dialog.confirm({
            message: '确认修改信息吗？',
        })
        .then(() => {
            const params = {
                userName: this.userDetail.userName,
                phone: this.userDetail.phone,
                email: this.userDetail.email,
            }
            updateUserInfo(params).then((res:any) => {
                if (res && res.code === '0') {
                    this.$toast('修改信息成功')
                    this.goback()
                } else {
                    this.$toast(res && res.msg ? res.msg : '修改信息失败')
                }
            }).catch(err => {
                this.$toast('修改信息失败')
            })
        })
        .catch(() => {});
    }

    getUserDetail(){
        const userId = this.$route.query.userId
        getUserDetailById(userId).then((res:any) => {
            if (res && res.code === '0') {
                this.userDetail = res.data
            } else {
                this.$toast(res && res.msg ? res.msg : '获取用户信息失败')
            }
        }).catch(err => {
            this.$toast('获取用户信息失败')
        })
    }

    testInput(text:any){
        if (text == 'userName') {
            if (!this.userDetail.userName) {
                this.$set(this.errorMessage,text,'请输入用户名')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'phone') {
            if (!this.userDetail.phone 
                || !(/^1[3456789]\d{9}$/.test(this.userDetail.phone))) {
                this.$set(this.errorMessage,text,'请输入正确的电话号码')
                return false
            }else{
                this.$set(this.errorMessage,text,'')
                return true
            }
        }else if (text == 'email') {
            if (!this.userDetail.email 
                || !(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.userDetail.email))) {
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
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
    color: #fff;
    vertical-align: middle;
}
.updateBody{
    padding: 20px;
}
</style>
