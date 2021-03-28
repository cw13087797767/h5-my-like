<template>
    <div>
        我的主页
        <input type="button" value="显示弹窗" @click="handleAlert(true)">
        <div class="alert" v-if="alertFlag"  @click="handleAlert(false)"></div>
    </div>
</template>

<script lang="ts">
import {Vue,Component} from 'vue-property-decorator';
import { State,Mutation } from 'vuex-class';
import homeApi from '@/api/homeApi'

@Component
export default class MyComponent extends Vue {
    @Mutation('set_headerText') set_headerText:any;
    private alertFlag:boolean = false
    activated() {
        this.set_headerText('我的')
    }
    
    mounted(){
        window.onhashchange = () =>{
            if (this.alertFlag) {
                 this.handleAlert(false)
            }
        }
    }

    handleAlert(flag:any) {
        this.alertFlag = flag
        if (flag) {
            window.history.pushState(null,'',location.href + '&showFlag')
        }else{
            if (location.href.indexOf("&showFlag") > -1) {
                window.history.back()
            }
        }
    }

}
</script>

<style lang="less" scoped>
.alert{
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 9;
}
</style>