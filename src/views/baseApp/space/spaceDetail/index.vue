<template>
    <div class="ctn">
        <van-nav-bar
            title="日记详情"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
        >
            <template #right>
                <!-- <van-icon name="edit" color="#fff" /> -->
                <!-- <van-icon name="delete-o" color="#fff" /> -->
                <!-- <van-icon name="delete-o" /> -->
                <van-icon v-if="showDelete" name="delete" color="#fff" @click="onClickRight"/>
            </template>
        </van-nav-bar>
        <div class="body">
            <p class="content">
                {{detail.content}}
            </p>
            <p v-if="detail.address" class="address">
                <van-icon name="location-o" />
                {{ detail.address }}
            </p>
            <div class="imgCtn">
                <div class="imgBody" v-for="(item, index) in imgList" :key="index" :style="imgCtnStyle">
                    <div 
                        class="img" 
                        :style="`background-image: url(${item})`" 
                        @click="showImgPreview(index)"
                    ></div>
                </div>
            </div>
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
import { spaceDetail, spaceDelete } from '@/api/baseApp/space'

@Component
export default class SpaceDetail extends Vue {

    private loading:boolean = false
    private detail:any = {}
    private imgList:Array<any> = []
    private imgPrevIndex:number = 1
    private startPosition:number = 1
    private imgPreview:boolean = false
    private imgCtnStyle:any = ''
    private showDelete:boolean = false

    activated() {
        this.detail = {}
        this.imgList = []
        this.imgPrevIndex = 1
        this.startPosition = 1
        this.imgPreview = false
        this.getDetail()
    }
    

    getDetail(){
        this.loading = true
        const { id, userId } = this.$route.query
        spaceDetail({id, userId}).then((res: any) => {
            if (res && res.code === '0') {
                this.detail = res.data
                this.imgList = res.data.imgUrl || []
                switch (this.imgList.length) {
                    case 1:
                        this.imgCtnStyle = `width:100%;padding-bottom:100%`
                        break;
                    case 2:
                    case 3:
                    case 4:
                        this.imgCtnStyle = `width:50%;padding-bottom:50%`
                        break;
                    default:
                        this.imgCtnStyle = ``
                        break;
                }
                const userConfig:any = window.localStorage.getItem('userConfig')
                this.showDelete = this.detail.userId && userConfig && this.detail.userId === JSON.parse(userConfig).userId
            } else {
                this.$toast(res && res.msg ? res.msg : '获取详情失败')
            }
        }).catch(err => {
            this.$toast('获取详情失败')
        }).finally(() => {
            this.loading = false
        })
    }

    showImgPreview(index:any){
        this.imgPrevIndex = index + 1
        this.startPosition = index
        this.imgPreview = true
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    onClickRight(){
        // this.$router.push(`/baseApp/space/editSpace?id=${1}`)
    }

    howImgPreview(index:any){
        this.imgPrevIndex = index + 1
        this.startPosition = index
        this.imgPreview = true
    }

    onChange(index:any) {
      this.imgPrevIndex = index+1;
    }
}
</script>

<style lang="less" scoped>
    .ctn{
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .body{
            flex: 1;
            width: 100%;
            overflow: auto;
            padding: 20px;
            .content{
                line-height: 35px;
                margin-bottom: 10px;
            }
            .address{
                text-align: right;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                color: #999999;
            }
        }
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
            }
        }
    }
</style>