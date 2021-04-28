<template>
    <div class='home'>
        <van-nav-bar 
            class="nav-title"
            title="音乐"
        >
            <template #right>
                <van-icon name="setting-o" color="#fff" size="20" @click="onchangeShowConfig()"/>
            </template>
        </van-nav-bar>
        <div class="home-body">
            <!-- 配置功能 -->
            <div class="config-ctn" :style="`max-height:${showConfig ? '150px' :'0px'}`">
                <van-tabs v-model="activeType" class="music-tabs">
                    <van-tab title="三角形" name="0">
                        <div class="tab-ctn">
                            <slider-picker v-model="TriangleColors" @input="updateColor"></slider-picker>
                        </div>
                    </van-tab>
                    <van-tab title="音频柱子" name="1">
                        <div class="tab-ctn">
                            <slider-picker v-model="barColors" @input="updateColor"></slider-picker>
                        </div>
                    </van-tab>
                    <van-tab title="音频线" name="2">
                        <div class="tab-ctn">
                            <slider-picker v-model="linesColors" @input="updateColor"></slider-picker>
                        </div>
                    </van-tab>
                    <van-tab title="其他配置" name="3">
                        <div class="tab-ctn">
                            <!-- <p style="color:#fff">
                                <span>切换背景：</span>
                                <van-radio-group v-model="bgImgRadio" direction="horizontal">
                                    <van-radio name="1"><span style="color:#fff">幻夜星空</span></van-radio>
                                    <van-radio name="2"><span style="color:#fff">璀璨灯火</span></van-radio>
                                    <van-radio name="3"><span style="color:#fff">魔幻世界</span></van-radio>
                                </van-radio-group>
                            </p> -->
                            <p class="tab-select-p">
                                <span>视角旋转：</span>
                                <van-checkbox v-model="autoRotate" shape="square"><span style="color:#fff">自动旋转</span></van-checkbox>
                            </p>
                            <p class="tab-select-p">
                                <span>离开页面后音乐是否继续播放：</span>
                                <van-checkbox v-model="playWhenLeave" shape="square"><span style="color:#fff">继续播放</span></van-checkbox>
                            </p>
                        </div>
                    </van-tab>
                </van-tabs>
                <!-- <div class="close" @click="showConfig=false">
                    <van-icon name="arrow-up" color="#fff" size="30"/>
                </div> -->
            </div>
            <!-- <div 
                class="show-config" 
                :style="`top:${showConfig ? '-160px' : '0px'}`"
                @click="showConfig=true"
            >
                <van-icon name="arrow-down" color="#fff" size="30"/>
            </div> -->
            <!-- 播放控制 -->
            <div class="play-ctrl" :style="`bottom:${showPlayDetail ? '0' : '-160px'};opacity:${showPlayDetail ? '1' :'0'}`">
                <div class="play-top">
                    <p class="play-msg">
                        <span>富士山下</span>
                        <span>&nbsp;—&nbsp;陈奕迅</span>
                    </p>
                    <!-- <div class="play-progress">
                        <p class="label">{{ formatPlayTime(musicModule.musicCurrentTime) }}</p>
                        <van-slider 
                            v-model="musicModule.musicCurrentTime" 
                            @change="onChangePlayProgress" 
                            :max="musicModule.musicMaxTime" 
                            button-size="10px"
                            active-color="#fff"
                            inactive-color="rgba(255,255,255,0.3)"
                        />
                        <p class="label">{{ formatPlayTime(musicModule.musicMaxTime) }}</p>
                    </div> -->
                </div>
                <div class="play-bottom">
                    <div class="img-plea">
                        <img v-if="playType === '0'" @click="onchangePlayType('1')" src="../../../assets/icon/loop.png" alt="" srcset="">
                        <img v-if="playType === '1'" @click="onchangePlayType('2')" src="../../../assets/icon/loop_one.png" alt="" srcset="">
                        <img v-if="playType === '2'" @click="onchangePlayType('0')" src="../../../assets/icon/random.png" alt="" srcset="">
                    </div>
                    <div class="play-bottom-center">
                        <img src="../../../assets/icon/last.png" alt="" srcset="">
                        <div>
                            <img v-if="playStatus" @click="onchangePlay(false)" src="../../../assets/icon/stop.png" alt="" srcset="">
                            <img v-else @click="onchangePlay(true)" src="../../../assets/icon/play.png" alt="" srcset="">
                        </div>
                        <img src="../../../assets/icon/next.png" alt="" srcset="">
                    </div>
                    <img src="../../../assets/icon/list.png" alt="" srcset="">
                </div>
                <div class="play-hide" @click="onchangeshowPlayDetail()">
                    <van-icon name="arrow-down" color="#fff" size="30"/>
                </div>
            </div>
            <div class="play-show" @click="onchangeshowPlayDetail()" :style="`bottom:${showPlayDetail ? '-160px' : '0'};opacity:${showPlayDetail ? '0' :'1'}`">
                <van-icon name="arrow-up" color="#fff" size="30"/>
            </div>
            <!-- 搜索列表 -->
            <div class="search-ctn" :style="`top:${showSearch ? '0' : '-100%'}`">
                <div class="search-body">
                    <input type="text" name="" id="" placeholder="搜点啥">
                    <div class="search-delete">
                        <van-icon name="cross" color="#fff" size="20"/>
                    </div>
                </div>
                <div class="search-list">
                    <ul v-if="musicList && musicList.legnth > 0">
                        <li v-for="(item, index) in musicList" :key="index">
                            <div class="list-num">{{ index + 1 }}</div>
                            <div class="list-detail">
                                <p>富士山下</p>
                                <p>陈奕迅</p>
                            </div>
                            <div class="list-ctrl">
                                <van-icon name="play-circle-o" color="#fff" size="20"  style="padding:5px"/>
                                <van-icon name="plus" color="#fff" size="20" style="margin:0 10px;padding:5px"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="search-mask" @click="onchangeShowSearch(false)"></div>
            </div>
            <div class="show-search" v-if="!showConfig" :style="`top:${showSearch ? '-100%' : '0'}`" @click="onchangeShowSearch(true)">
                <van-icon name="search" color="#fff" size="20"/>
            </div>
            <Music3D 
                ref="music3D"
                :TriangleColors="TriangleColors.hex"
                :barColors="barColors.hex"
                :linesColors="linesColors.hex"
                :autoRotate="autoRotate"
            />
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { State,Mutation } from 'vuex-class'
import Music3D from '@/components/home/music/index.vue'
import { Slider } from 'vue-color'

@Component({
    components:{
        Music3D,
        "slider-picker": Slider,
    }
})
export default class MusicComponent extends Vue{

    @State('musicModule') musicModule:any
    @Mutation('set_musicCurrentTime') set_musicCurrentTime: any

    private TriangleColors:any = {
        hex: "#B3E5D5",
    }
    private barColors:any = {
        hex: "#79B6D2",
    }
    private linesColors:any = {
        hex: "#BF4096",
    }
    private showConfig:boolean = false
    private activeType:string = '0'
    private colorTimer:any = null
    private autoRotate:boolean = true
    private playWhenLeave:boolean = true
    private bgImgRadio:string = '1'
    private playType:string = '0'
    private playStatus:boolean = false
    private showPlayDetail:boolean = false
    private musicList:Array<any> = []
    private showSearch:boolean = false

    mounted() {
        const musicColorConfig = window.localStorage.getItem('musicColorConfig')
        if (musicColorConfig) {
            const {
                TriangleColors,
                barColors,
                linesColors,
            } = JSON.parse(musicColorConfig)
            this.TriangleColors.hex = TriangleColors
            this.barColors.hex = barColors
            this.linesColors.hex = linesColors
        }
    }

    activated(){
        
    }

    deactivated() {
        if (!this.playWhenLeave) {
            this.onchangePlay(false)
        }
    }

    onchangeShowConfig(){
        this.showConfig = !this.showConfig
        if (this.showConfig) {
            this.onchangeShowSearch(false)
        }
    }

    onchangeShowSearch(type:boolean){
        this.showSearch = type
    }

    formatPlayTime(val:number){
        const mins = Math.floor(val / 60)
        const seconds = val - mins * 60
        return `${mins < 10 ? '0' + mins : mins}:${seconds < 10 ? '0' + seconds : seconds}`
    }

    onchangePlay(type:boolean){
        this.playStatus = type
        this.$refs.music3D && (this.$refs.music3D as Music3D).handleAudioPlay(type)
    }

    onchangeshowPlayDetail(){
        this.showPlayDetail = !this.showPlayDetail
    }

    onchangePlayType(type:string){
        if (type === this.playType) {
            return
        }
        this.playType = type
        this.$toast({
            position:"bottom",
            message:(() => {
                switch (type) {
                    case '0':
                        return '列表循环'
                    case '1':
                        return '单曲循环'
                    case '2':
                        return '随机播放'
                    default:
                        return '列表循环'
                }
            })()
        })
        window.localStorage.setItem('musicPlayType',this.playType)
    }

    onChangePlayProgress(value:number){
        // const that = this.$refs['music3D'] as Music3D
        // that.handleAudioPlay(false)
        (this.$refs.music3D as Music3D).setPlayCurrentTime(value)
        // (this.$refs.music3D as Music3D).handleAudioPlay(this.playStatus)

    }

    updateColor(){
        if (this.colorTimer) {
            clearTimeout(this.colorTimer)
            this.colorTimer = null
        }
        this.colorTimer = setTimeout(() => {
            const musicColorConfig = {
                TriangleColors:this.TriangleColors.hex,
                barColors:this.barColors.hex,
                linesColors:this.linesColors.hex,
            }
            window.localStorage.setItem('musicColorConfig',JSON.stringify(musicColorConfig))
        }, 200);
    }


    handleShowConfig(){
        this.showConfig = !this.showConfig
    }
}

</script>

<style lang='less' scoped>
    .home{
        width: 100%;
        height: 100%;
        .home-body{
            height: calc(~"100% - 90px");
            overflow: hidden;
            position: relative;
        }
        .config-ctn{
            transition: all ease 0.3s;
            overflow: hidden;
            width: 100%;    
            // height: 150px;
            
            position: absolute;
            z-index: 3;
            top: 0;
            left: 0;
            background: rgba(255,255,255,0.2);
            .close{
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 0);
                height: 30px;
                padding: 0 20px;
            }
        }
        .show-config{
            position: absolute;
            z-index: 2;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            transition: all ease 0.3s;
            padding: 0 20px;
        }
    }
    .tab-ctn{
        width: 100%;
        padding: 10px 10% 0;
        .tab-select-p{
            color:#fff;
            padding-top:5px;
            display: flex;
            align-items: center;
        }
    }
    .vc-slider{
        width: 100%;
    }
    .music-tabs{
        padding-bottom: 15px;
        /deep/.van-tabs__nav{
            background-color: transparent;
        }
        /deep/.van-tab{
            color: #fff;
        }
        /deep/.van-tab--active{
            color: #fff;
            font-weight: bold;
        }
        /deep/.van-tabs__line{
            background-color: #f7f8fa;
        }
    }
    .play-ctrl{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(255,255,255,0.2);
        transition: all ease 0.3s;
        // overflow: hidden;
        z-index: 2;
        padding: 0 15px 10px;
        .play-top{
            // height: 50px;
            width: 100%;
            .play-msg{
                line-height: 30px;
                color: #fff;
                &>:nth-child(1){
                    font-size: 16px;
                }
            }
            .play-progress{
                display: flex;
                align-items: center;
                color: #fff;
                &>:nth-child(1){
                    padding-right: 10px;
                }
                &>:nth-child(3){
                    padding-left: 10px;
                }
            }
        }
        .play-bottom{
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .img-plea{
                height: 22px;
                width: 22px;
            }
            img{
                height: 22px;
                width: auto;
            }
            .play-bottom-center{
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                &>:nth-child(2){
                    margin: 0 12%;
                    height: 35px;
                    width: 35px;
                    img{
                        height: 100%;
                        width: auto;
                    }
                }
            }
        }
        .play-hide{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -100%);
            transition: all ease 0.3s;
            opacity: 1;
            padding: 10px 10px 0;
        }
    }
    .play-show{
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 2;
        padding: 10px 10px 0;
        transition: all ease 0.3s;
    }
    .search-ctn{
        width: 100%;
        height: 100%;
        z-index: 3;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        transition: all ease 0.3s;
        .search-body{
            height: 45px;
            background-color: rgba(255,255,255,0.3);
            position: relative;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            input{
                height: 30px;
                padding: 0px 15px;
                width: 100%;
                box-sizing: border-box;
                background: transparent;
                border: solid 1px #bfbbbb;
                border-radius: 30px;
                color: #fff;
                font-size: 16px;
            }
            input::-webkit-input-placeholder {
                color: rgb(211, 211, 211);
            }
            input::-moz-input-placeholder {
                color: rgb(211, 211, 211);
            }
            input::-ms-input-placeholder {
                color: rgb(211, 211, 211);
            }
            .search-delete{
                position: absolute;
                right: 25px;
                top: 50%;
                transform: translate(0, -50%);
                padding: 5px;
            }
        }
        .search-list{
            max-height: 50vh;
            background: rgba(255,255,255,0.3);
            overflow: auto;
            ul{
                padding-top: 15px;
                height: 100%;
                li{
                    display: flex;
                    height: 45px;
                    color: #fff;
                    align-items: center;
                    border-bottom: solid 1px #5d5d5d;
                    .list-num{
                        width: 35px;
                        text-align: center;
                    }
                    .list-detail{
                        flex: 1;
                        padding: 0 15px;
                        &>:nth-child(2){
                            font-size: 12px;
                            color: #c3c3c3;
                        }
                    }
                }
            }
        }
        .search-mask{
            flex: 1;
            width: 100%;
        }
    }
    .show-search{
        position: absolute;
        top: -100%;
        left: 50%;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        padding: 10px;
        z-index: 2;
        transition: all ease 0.3s;
    }
</style>