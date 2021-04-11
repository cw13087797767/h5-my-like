<template>
    <div class="ctn">
        <van-nav-bar
            title="我的空间"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
            @click-right="onClickRight"
        >
            <template #right>
                <van-icon name="plus" color="#fff" />
            </template>
        </van-nav-bar>
        <div class="body">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <div class="body-top">
                    <p>{{ userDetail.userName || '' }}</p>
                    <img :src="userDetail.userImg || require(`@/assets/yu_tou.png`)" alt="" srcset="">
                </div>
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <div 
                        class="list-main" 
                        v-for="(item, index) in list" 
                        :key="index"
                        @click="toDetail(item)"
                    >
                        <div class="main-header">
                            <div class="main-left">
                                <div class="main-left-top">{{ formatTime(item.createTime,'top')}}</div>
                                <div class="main-left-bottom">{{ formatTime(item.createTime,'bottom')}}</div>
                            </div>
                            <div class="main-right">
                                <div 
                                    v-if="item.imgUrl && item.imgUrl.length > 0" 
                                    class="first-img"
                                    :style="`background-image:url(${item.imgUrl[0]})`"
                                ></div>
                                <div class="content">
                                    {{ item.content }}
                                </div>
                            </div>
                        </div>
                        <div v-if="item.address" class="main-footer">
                            <van-icon name="location-o" />
                            {{ item.address }}
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
            <div class="list-ctn">

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { spaceList } from '@/api/baseApp/space'
import { getUserDetailById } from '@/api/userApi'
import dayjs from 'dayjs'

@Component
export default class MySpace extends Vue {

    private userDetail:any = {}
    private refreshing:boolean = false
    private loading:boolean = false
    private finished:boolean = false
    private list:Array<any> = []
    private pageNum:number = 1
    private total:number = 0

    activated() {
        this.refreshing = false
        this.loading = false
        this.finished = false
        this.list = []
        this.pageNum = 1
        this.total = 0
        this.getSpaceList()
    }

    mounted(){
        this.getUserDetail()
    }

    onRefresh(){
        this.pageNum = 1
        this.list = []
        this.finished = false
        this.getSpaceList()
    }

    onLoad(){
        this.pageNum += 1
        this.getSpaceList()
    }

    formatTime(timeStr:any,type:any){
        if (!timeStr) return ''
        if (type === 'top') {        
            if (dayjs(+timeStr).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ) return '今天'
            if (dayjs(+timeStr).format('YYYY-MM-DD') === dayjs().subtract(1,'day').format('YYYY-MM-DD') ) return '昨天'
            return dayjs(+timeStr).format('YYYY-MM-DD')
        } else {
            return dayjs(+timeStr).format('HH:mm:ss')
        }
    }

    getUserDetail(){
        const userConfig:any = window.localStorage.getItem('userConfig')
        if (userConfig) {
            const userId = JSON.parse(userConfig)
            getUserDetailById(userId).then((res:any) => {
                if (res && res.code === '0') {
                    this.userDetail = res.data || {}
                } else {
                    this.$toast(res && res.msg ? res.msg : '获取用户信息失败')
                }
            }).catch(err => {
                this.$toast('获取用户信息失败')
            })
        }
    }

    getSpaceList(){
        this.loading = true
        spaceList(this.pageNum).then((res:any) => {
            if (res && res.code === '0') {
                const {
                    total,
                    list
                } = res.data
                this.total = total
                this.list.push(...list)
            }
        }).catch(err => {

        }).finally(() => {
            this.loading = false
            this.refreshing = false
            if (this.pageNum * 10 > this.total) {
                this.finished = true
            }
        })
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    onClickRight(){
        this.$router.push(`/baseApp/space/editSpace`)
    }

    toDetail(obj:any){
        this.$router.push(`/baseApp/space/spaceDetail?id=${obj.id}&userId=${obj.userId}`)
    }
}
</script>

<style lang="less" scoped>
    .ctn{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .body{
            flex: 1;
            width: 100%;
            overflow: auto;
            .body-top{
                height: 100px;
                width: 100%;
                background-color: antiquewhite;
                position: relative;
                margin-bottom: 20px;
                p{
                    position: absolute;
                    left: 20px;
                    bottom: 10px;
                    font-weight: bold;
                    font-size: 16px;
                }
                img{
                    height: 65px;
                    width: 65px;
                    position: absolute;
                    right: 20px;
                    bottom: 0;
                    border-radius: 50%;
                    transform: translate(0, 20px);
                }
            }
        }
    }
    .list-main{
        padding: 10px 20px;
        .main-header{
            height: 80px;
            width: 100%;
            display: flex;
            .main-left{
                width: 100px;
                padding-right: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .main-left-top{
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    line-height: 40px;
                }
                .main-left-bottom{
                    color: #999999;
                }
            }
            .main-right{
                flex: 1;
                display: flex;
                .first-img{
                    height: 80px;
                    width: 80px;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    border-radius: 6px;
                    margin-right: 10px;
                }
                .content{
                    flex: 1;
                    line-height: 26px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
            }
        }
        .main-footer{
            text-align: right;
            line-height: 20px;
            color: #999999;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }
</style>