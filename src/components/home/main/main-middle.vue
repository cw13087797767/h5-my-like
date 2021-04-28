<template>
    <div class="main-middle-container">
        <div class="main-middle-body">
            <p>我的应用</p>
            <ul>
                <li 
                    v-for="(item, index) in workList" 
                    :key="index"
                    @click="toWork(item)">
                    <img :src="item.img" alt="">
                    <br>
                    <span>{{ item.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue,Component } from "vue-property-decorator";
import { getIconByKey } from '@/util/util'
@Component
export default class HomeMainMiddleComponent extends Vue {
    private workList:Array<any> = []

    created() {
        this.workList = [
            {
                img:getIconByKey('space'),
                label:'我的空间',
                routeName:'baseAppSpaceMySpace'
            },
            {
                img:getIconByKey('camera'),
                label:'图片上传测试',
                routeName:'baseAppUploadImg'
            },
        ]
    }
    toWork(obj:any){
        this.$router.push({
            name:obj.routeName,
        })
    }
}

</script>

<style lang="less" scoped>
.main-middle-container{
    padding: 7px;
    .main-middle-body{
        padding: 10px;
        p{
            font-size: 14px;
            padding: 7px 10px;
            color: #666;
        }
        border: solid 0.5px #eaeaea;
        box-shadow: 2px 2px 3px #eaeaea;
        border-radius: 10px;
    }
    ul{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        li{
            width: 33%;
            text-align: center;
            padding: 0 0 5px 0;
            img{
                height: 40px;
                width: 40px;
            }
            span{
                color: #999;
                font-size: 12px;
            }
        }
    }
}
</style>

