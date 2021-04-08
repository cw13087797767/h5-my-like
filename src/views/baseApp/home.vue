<template>
    <div class="vapp">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'

@Component
export default class vappHome extends Vue {
    
}
</script>
<style lang="less" scoped>
.vapp{
    height: 100%;
    width: 100%;
}
</style>