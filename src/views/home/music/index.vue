<template>
    <div class='home'>
        <van-nav-bar 
            class="nav-title"
            title="音乐"
        />
        <div class="home-body">
            <Music3D></Music3D>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { State,Mutation } from 'vuex-class'
import Music3D from '@/components/home/music/index.vue'

@Component({
    components:{
        Music3D
    }
})
export default class MusicComponent extends Vue{

    activated(){

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
    }
</style>