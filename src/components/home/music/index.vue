<template>
    <div class='home'>
        <div id="musicId" style="width:100%; height:100%"></div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { State,Mutation } from 'vuex-class'
import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'
const m79621 = require("@/assets/mp3/79621.mp3")
import { getCiclePoints } from '@/util/util'

@Component
export default class Music3D extends Vue{

    private Scene:any = null            // 场景
    private ambientLine:any = null      // 环境光
    private camera:any = null           // 相机
    private webGLRenderer:any = null    // 渲染器
    private controls:any = null         // 控制器
    private analyser:any = null         // 分析变量器
    private linstener:any = null        // 监听器
    private audio:any = null            // 非位置音频对象
    private audioLoader:any = null      // 音频加载器
    private group:any = null            // 音频文件分组

    mounted(){
        this.renderFunc()
    }

    activated(){

    }

    // 渲染入口
    renderFunc(){
        this.Scene = new THREE.Scene()
        // 添加环境光
        this.ambientLine = new THREE.AmbientLight(0x000000)
        this.Scene.add(this.ambientLine)
        // const point = new THREE.PointLight(0xffffff)
        //点光源位置
        // point.position.set(500,600,1000)
        //点光源添加到场景中
        // this.Scene.add(point)
        // 添加相机
        const domCtn:any = document.getElementById("musicId")
        const width:number = domCtn.offsetWidth
        const height:number = domCtn.offsetHeight
        const k = width / height
        const s = 200
        this.camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1600)
        this.camera.position.set(0, 300, 700)
        this.camera.lookAt(this.Scene.position)
        // 渲染器
        this.webGLRenderer = new THREE.WebGL1Renderer()
        this.webGLRenderer.setSize(width, height)
        // this.webGLRenderer.setClearColor(0xb9d3ff, 1)
        domCtn.appendChild(this.webGLRenderer.domElement)
        // 控制器
        this.controls = new OrbitControls(this.camera, this.webGLRenderer.domElement)
        const axesHelper = new THREE.AxesHelper(250)
        this.Scene.add(axesHelper)
        // 创建音频显示分组
        this.addAudioGroup()
        this.addListener()
        // 定时渲染
        const renderTimer = () => {
            this.webGLRenderer.render(this.Scene, this.camera)
            requestAnimationFrame(renderTimer)
            if (this.analyser) {
                // 获得频率数据N个
                const arr = this.analyser.getFrequencyData()
                this.group.children.forEach((elem:any, index:any) => {
                    const scaleZ = arr[index * 2] / 50
                    const colorPercent = arr[index * 2] / 200
                    elem.scale.z = scaleZ < 0.2 ? 0.2 : scaleZ
                    elem.material.color.g = colorPercent < 0.5 ? 0.5 : (colorPercent > 0.8 ? 0.8 : colorPercent)
                })
            }
        } 
        renderTimer()
    }

    // 添加监听
    addListener(){
        this.linstener = new THREE.AudioListener()
        this.camera.add(this.linstener)
        this.audio = new THREE.Audio(this.linstener)
        this.audioLoader = new THREE.AudioLoader()
        this.audioLoader.load(m79621, (AudioBuffer: any) => {
            this.audio.setBuffer(AudioBuffer)   // 音频缓冲区对象关联到音频对象audio
            this.audio.setLoop(false)           //是否循环
            this.audio.setVolume(0.5)           //音量
            this.audio.play()                   //播放
            // 音频分析器和音频绑定，可以实时采集音频时域数据进行快速傅里叶变换
            this.analyser = new THREE.AudioAnalyser(this.audio)
        })
    }

    addAudioGroup(){
        this.group = new THREE.Group()
        //控制音频分析器返回频率数据数量
        const points:Array<any> = getCiclePoints(60,36)
        points.map((item:any) => {
            //创建一个立方体几何对象
            const box:any = new THREE.BoxGeometry(10, 10, 10)
            // box.rotateY(item.rotate)
            //材质对象
            const material:any = new THREE.MeshBasicMaterial({
                color:0x0080ff,
                // opacity:0.6,
                transparent:true
            })
            //网格模型对象
            const mesh:any = new THREE.Mesh(box, material)
            mesh.position.set(item.x, 0, item.y)
            mesh.scale.z = 0.2
            mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), item.rotate)
            this.group.add(mesh)
        })
        this.Scene.add(this.group)
    }

}

</script>

<style lang='less' scoped>
    .home{
        height: 100%;
        width: 100%;
        position: relative;
    }

</style>