<template>
    <van-tabbar v-model="footerModule.activeIndex">
      <van-tabbar-item icon="wap-home-o" to="/home/main">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/home/resource">资源</van-tabbar-item>
      <!-- <van-tabbar-item icon="chart-trending-o" to="/home/grid">网格</van-tabbar-item> -->
      <van-tabbar-item icon="service-o" to="/home/music">音乐</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o" to="/home/my?id=1">我的</van-tabbar-item>
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
      this.$router.push('/home/main')
    }else if (index == 1) {
      this.$router.push('/home/resource')
    }else if (index == 2) {
      this.$router.push('/home/music')
    }else if (index == 3) {
      this.$router.push('/home/my')
    }
  }
}
</script>

<style lang="less" scoped>
.footer-container {
  height: 40px;
}
</style>
