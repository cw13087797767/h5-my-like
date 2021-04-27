<template>
    <div class='home'>
        <van-nav-bar 
            class="nav-title"
            title="音乐"
        >
            <!-- <template #right>
                <van-icon name="setting-o" color="#fff" @click="handleShowConfig()"/>
            </template> -->
        </van-nav-bar>
        <div class="home-body">
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
                            <p style="color:#fff;padding-top:5px">
                                <span>视角旋转：</span>
                                <van-checkbox v-model="autoRotate" shape="square"><span style="color:#fff">自动旋转</span></van-checkbox>
                            </p>
                        </div>
                    </van-tab>
                </van-tabs>
                <div class="close" @click="showConfig=false">
                    <van-icon name="arrow-up" color="#fff" size="30"/>
                </div>
            </div>
            <div 
                class="show-config" 
                :style="`top:${showConfig ? '-30px' : '0px'}`"
                @click="showConfig=true"
            >
                <van-icon name="arrow-down" color="#fff" size="30"/>
            </div>
            <Music3D 
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
    private bgImgRadio:string = '1'

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
            overflow: auto;
            position: relative;
        }
        .config-ctn{
            transition: all ease 0.3s;
            overflow: hidden;
            width: 100%;
            height: 150px;
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
    }
    .vc-slider{
        width: 100%;
    }
    .music-tabs{
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
</style>