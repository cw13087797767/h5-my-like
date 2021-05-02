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
            <!-- 搜索列表 -->
            <div class="search-ctn" :style="`top:${showSearch ? '0' : '-100%'}`">
                <div class="search-body">
                    <input 
                        v-model="searchVal" 
                        @input="searchMusicList" 
                        type="text" 
                        name="" 
                        id="" 
                        placeholder="搜点啥"
                        ref="inputref"
                    >
                    <div class="search-delete">
                        <van-icon @click="cleanSearch()" name="cross" color="#fff" size="20"/>
                    </div>
                </div>
                <div class="music-list">
                    <div class="nodata" v-if="!musicList || musicList.length === 0">暂无数据</div>
                    <ul v-if="musicList && musicList.length > 0">
                        <li v-for="(item, index) in musicList" :key="index">
                            <div class="list-num">{{ index + 1 }}</div>
                            <div class="list-detail">
                                <p>{{ item.name || ' ' }}</p>
                                <p>{{ item.singerName || ' ' }}</p>
                            </div>
                            <div class="list-ctrl">
                                <van-icon @click="playMusic(item)" name="play-circle-o" color="#fff" size="20"  style="padding:5px"/>
                                <van-icon @click="addMusicToPlayList(item)" name="plus" color="#fff" size="20" style="margin:0 10px;padding:5px"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="mask" @click="onchangeShowSearch(false)"></div>
            </div>
            <div 
                class="show-search" 
                :style="`top:${showSearch ? '-100%' : '0'}`" @click="onchangeShowSearch(true)"
                v-if="!showConfig" 
            >
                <van-icon name="search" color="#fff" size="20"/>
            </div>
            <div class="play-list" v-if="showPlayList">
                <div class="mask" @click="handleShowPlayList(false)"></div>
                <div class="play-list-ctn">
                    <div v-if="!playList || playList.length === 0" class="nodata">播放列表空空如也</div>
                    <div class="music-list" style="background-color: transparent;">
                        <ul>
                            <li v-for="(item, index) in playList" :key="index">
                                <div class="list-num">{{ index + 1 }}</div>
                                <div class="list-detail" :style="activePlayMusic && activePlayMusic.id === item.id ? 'color:#ff8c8c' : ''">
                                    <p>{{ item.name || ' ' }}</p>
                                    <p>{{ item.singerName || ' ' }}</p>
                                </div>
                                <div class="list-ctrl">
                                    <van-icon @click="playMusic(item, '2')" name="play-circle-o" color="#fff" size="20"  style="padding:5px"/>
                                    <van-icon @click="delMusic(item, index)" name="delete" color="#fff" size="20" style="margin:0 10px;padding:5px"/>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 播放控制 -->
            <div 
                v-if="showPlayCtrl"
                class="play-ctrl" 
                :style="`bottom:${showPlayDetail ? '0' : '-160px'};opacity:${showPlayDetail ? '1' :'0'}`"
            >
                <div class="play-top">
                    <p class="play-msg">
                        <span>{{ activePlayMusic? activePlayMusic.name : '' }}</span>
                        <span>{{ activePlayMusic ? ' — ' + activePlayMusic.singerName : '' }}</span>
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
                        <img @click="playLast()" src="../../../assets/icon/last.png" alt="" srcset="">
                        <div>
                            <img v-if="playStatus" @click="onchangePlay(false)" src="../../../assets/icon/stop.png" alt="" srcset="">
                            <img v-else @click="onchangePlay(true)" src="../../../assets/icon/play.png" alt="" srcset="">
                        </div>
                        <img @click="playNext()" src="../../../assets/icon/next.png" alt="" srcset="">
                    </div>
                    <img @click="handleShowPlayList(true)" src="../../../assets/icon/list.png" alt="" srcset="">
                </div>
                <div class="play-hide" @click="onchangeshowPlayDetail()">
                    <van-icon name="arrow-down" color="#fff" size="30"/>
                </div>
            </div>
            <div class="play-show" @click="onchangeshowPlayDetail()" :style="`bottom:${showPlayDetail ? '-160px' : '0'};opacity:${showPlayDetail ? '0' :'1'}`">
                <van-icon name="arrow-up" color="#fff" size="30"/>
            </div>
            <Music3D 
                ref="music3D"
                :TriangleColors="TriangleColors.hex"
                :barColors="barColors.hex"
                :linesColors="linesColors.hex"
                :autoRotate="autoRotate"
                @handlePlayEnd="handlePlayEnd"
            />
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { State,Mutation } from 'vuex-class'
import Music3D from '@/components/home/music/index.vue'
import { Slider } from 'vue-color'
import { getMusicList, getMusicUrl } from '@/api/music'

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
    private searchTimer:any = null
    private searchVal:string = ''
    private activePlayMusic:any = null
    private historyList:Array<any> = []
    private playList:Array<any> = []
    private showPlayList:boolean = false
    private showPlayCtrl:boolean = true

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
        const musicPlayType = window.localStorage.getItem('musicPlayType')
        if (musicPlayType) {
            this.playType = musicPlayType
        }
        const playListConfig = window.localStorage.getItem('playListConfig')
        if (playListConfig) {
            this.playList = JSON.parse(playListConfig)
        }
    }

    activated(){
        
    }

    deactivated() {
        if (!this.playWhenLeave) {
            this.onchangePlay(false)
        }
    }

    handleShowPlayList(flag:boolean){
        this.showPlayList = flag
        if (flag) {
            this.showPlayCtrl = false
            // this.showSearch = false
        } else {
            this.showPlayCtrl = true
            // this.showSearch = true
        }

    }

    delMusic(item:any, index:any){
        if (this.activePlayMusic && this.activePlayMusic.id === item.id) {
            this.playNext()
        }
        this.playList.splice(index, 1)
        window.localStorage.setItem('playListConfig',JSON.stringify(this.playList))
    }

    playLast(){
        if (this.historyList.length === 0) {
            this.$toast('没有更多历史播放歌曲啦')
        } else {
            const popMusic = this.historyList.pop()
            this.historyList.unshift(popMusic)
            this.activePlayMusic = this.historyList[this.historyList.length -1]
            this.getMusicUrlById(this.activePlayMusic.id)
        }
    }

    playNext(){
        this.playType !== '2' ? this.listForEach() : this.listRandom()
    }

    handlePlayEnd(){
        switch (this.playType) {
            // 列表循环
            case '0':
                this.listForEach()
                break;
            // 单曲循环
            case '1':
                // this.getMusicUrlById(this.activePlayMusic.id)
                break;
            // 随机播放
            case '2':
                this.listRandom()
                break;
            default:
                break;
        }
    }

    listForEach(){
        let _activePlayMusic = null
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].id === this.activePlayMusic.id) {
                _activePlayMusic =  i < this.playList.length - 1 ? this.playList[i+1] : this.playList[0]
            }
        }
        this.clearHistoryLsit(_activePlayMusic)
        this.activePlayMusic = _activePlayMusic
        this.getMusicUrlById(this.activePlayMusic.id)
    }

    listRandom(){
        let _activePlayMusic = null
        const randomIndex = Math.floor(this.playList.length * Math.random())
        console.log(randomIndex)
        _activePlayMusic = this.playList[randomIndex]
        this.clearHistoryLsit(_activePlayMusic)
        this.activePlayMusic = _activePlayMusic
        this.getMusicUrlById(this.activePlayMusic.id)
    }

    clearHistoryLsit(musicDetail:any){
        this.historyList.map((item:any, index:any) => {
            if (item.id === musicDetail.id) {
                this.historyList.splice(index, 1)
            }
        })
        this.historyList.push(musicDetail)
    }



    cleanSearch(){
        this.searchVal = '';
        this.musicList = [];
        (this.$refs['inputref'] as any).focus()
    }

    playMusic(musicDetail:any, type?:any){
        this.activePlayMusic = musicDetail
        // 添加进历史播放列表
        this.historyList.map((item:any, index:any) => {
            if (item.id === musicDetail.id) {
               this.historyList.splice(index, 1)
            }
        })
        this.historyList.push(musicDetail)
        // 添加进播放列表中
        let had:boolean = false
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].id === musicDetail.id) {
                had = true
            }
        }
        !had && this.playList.push(musicDetail)
        window.localStorage.setItem('playListConfig',JSON.stringify(this.playList))
        this.showSearch = false
        this.getMusicUrlById(musicDetail.id)
        if (type && type === '2') {
            this.showPlayList = false
            this.showPlayCtrl = true
        }
    }

    getMusicUrlById(id:any){
        getMusicUrl(id).then((res:any) => {
            if (res && res.code === '0' && res.data[0].url) {
                (this.$refs.music3D as Music3D).addListener(res.data[0].url || '', () => {
                    this.onchangePlay(true)
                })
            } else {
                this.$toast(res && res.msg ? res.msg : '获取音乐失败')
            }
        })
    }

    addMusicToPlayList(musicDetail:any){
        let flag = false
        this.playList.map((item:any) => {
            if (item.id === musicDetail.id) {
                flag = true
            }
        })
        if (flag) {
            this.$toast('该音乐已在播放列表中')
        } else {
            this.playList.push(musicDetail)
            this.$toast('添加成功')
            window.localStorage.setItem('playListConfig',JSON.stringify(this.playList))
        }
    }

    searchMusicList(){
        if (this.searchTimer) {
            clearTimeout(this.searchTimer)
            this.searchTimer = null
        }
        if (this.searchVal) {
            this.searchTimer = setTimeout(() => {
                this.getMusicList()
            }, 500);
        }
    }

    getMusicList(){
        getMusicList(this.searchVal).then((res:any) => {
            if (res && res.code === '0') {
                const arr:Array<any> = [];
                (res.data.songs || []).map((item:any) => {
                    arr.push({
                        name:item.name || '',
                        id:item.id,
                        singerName:item.artists[0].name
                    })
                })
                this.musicList = arr
            } else {
                this.$toast(res && res.msg ? res.msg : '获取列表失败')
            }
        })
    }

    onchangeShowConfig(){
        this.showConfig = !this.showConfig
        if (this.showConfig) {
            this.onchangeShowSearch(false)
        }
    }

    onchangeShowSearch(type:boolean){
        this.showSearch = type
        if (type) {
            (this.$refs['inputref'] as any).focus()
        }
    }

    formatPlayTime(val:number){
        const mins = Math.floor(val / 60)
        const seconds = val - mins * 60
        return `${mins < 10 ? '0' + mins : mins}:${seconds < 10 ? '0' + seconds : seconds}`
    }

    onchangePlay(type:boolean){
        if (this.activePlayMusic) {          
            this.playStatus = type
            this.$refs.music3D && (this.$refs.music3D as Music3D).handleAudioPlay(type)
        }
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
        window.localStorage.setItem('musicPlayType',this.playType);
        (this.$refs.music3D as Music3D).changeLoop(type === '1');
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
        padding: 10px 15px;
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
    }
    .mask{
        flex: 1;
        width: 100%;
    }
    .music-list{
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
    .nodata{
        text-align: center;
        line-height: 35px;
        color: #fff;
    }
    .play-list{
        position: absolute;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 3;
        display: flex;
        flex-direction: column;
        .play-list-ctn{
            width: 100%;
            background: rgba(255, 255, 255, 0.3);
            max-height: 60vh;
        }
    }
</style>