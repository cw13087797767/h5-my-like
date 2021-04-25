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
                <van-tabs v-model="activeType">
                    <van-tab title="三角形" name="0">
                        <div class="tab-ctn">
                            <slider-picker v-model="TriangleColors"></slider-picker>
                        </div>
                    </van-tab>
                    <van-tab title="音频柱子" name="1">内容 2</van-tab>
                    <van-tab title="音频线" name="2">内容 3</van-tab>
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
            <Music3D></Music3D>
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
        hex: "#194d33",
    }
    private barColors:any = {
        hex: "#194d33",
    }
    private linesColors:any = {
        hex: "#194d33",
    }
    private showConfig:boolean = false
    private activeType:string = '0'

    activated(){
        
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
</style>