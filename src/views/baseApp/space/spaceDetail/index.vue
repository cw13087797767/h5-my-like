<template>
    <div>
        <van-nav-bar
            title="日记详情"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
            @click-right="onClickRight"
        >
            <template #right>
                <van-icon name="edit" color="#fff" />
            </template>
        </van-nav-bar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SpaceDetail extends Vue {

    activated() {
        
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    onClickRight(){
        this.$router.push(`/baseApp/space/editSpace?id=${1}`)
    }
}
</script>