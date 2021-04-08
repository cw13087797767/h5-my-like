<template>
    <div>
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
        <div @click="toDetail({})">点我去详情</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MySpace extends Vue {

    activated() {
        
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    onClickRight(){
        this.$router.push(`/baseApp/space/editSpace`)
    }

    toDetail(obj:any){
        this.$router.push(`/baseApp/space/spaceDetail?id=${1}`)
    }
}
</script>