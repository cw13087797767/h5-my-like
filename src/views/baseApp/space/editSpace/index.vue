<template>
    <div>
        <van-nav-bar
            title="发布日记"
            left-arrow
            @click-left="onClickLeft"
            class="nav-title"
            @click-right="onClickRight"
        >
            <template #right>
                <span>发布</span>
            </template>
        </van-nav-bar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EditSpace extends Vue {

    activated() {
        
    }

    onClickLeft(){
        this.$router.go(-1)
    }

    onClickRight(){
        
    }
}
</script>