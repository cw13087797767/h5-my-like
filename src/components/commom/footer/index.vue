<template>
    <van-tabbar v-model="footerModule.activeIndex" @change="onChange">
      <van-tabbar-item icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o">地图</van-tabbar-item>
      <van-tabbar-item icon="service-o">音乐</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
@Component
export default class FooterComponent extends Vue {
  @State("footerModule") footerModule: any;

  onChange(index:any){
    if (index == 0) {
      this.$router.replace('/home/main')
    }else if (index == 1) {
      this.$router.replace('/home/resource')
    }else if (index == 2) {
      this.$router.replace('/home/music')
    }else if (index == 3) {
      this.$router.replace('/home/my?')
    }
  }
}
</script>

<style lang="less" scoped>
.footer-container {
  height: 40px;
}
</style>
