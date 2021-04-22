<template>
    <div class='home' id="homeCtn">
        <div id="musicId" style="width:100%; height:100%"></div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { State,Mutation } from 'vuex-class'
import * as THREE from 'three'
// import { OrbitControls } from 'three-orbitcontrols-ts'
const OrbitControls = require("three-orbitcontrols")
const m79621 = require("@/assets/mp3/79621.mp3")
import { getCiclePoints, randomRange, range } from '@/util/util'
import Triangle from '@/components/commom/base-component/triangle'
import node from '@/components/commom/base-component/node'
const Stats = require('stats-js')

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
    private audioBarGroup:any = null    // 音频柱子分组
    private triangleGroup:any = null    // 随即三角形分组
    private triangleArr:Array<any> = [] // 随即三角形数组
    private threeClock:any = new THREE.Clock()  // three时间
    private barNodes:Array<any> = []    // 音频柱状节点
    private barLines:Array<any> = []    // 音频线
    private outLine:any = null          // 音频外线
    private inLine:any = null           // 音频内线
    private linesGroup:any = null       // 音频线分组

    mounted(){
        this.renderFunc()
    }

    activated(){

    }

    // 渲染入口
    renderFunc(){
        this.Scene = new THREE.Scene()
        // 添加背景图片
        this.Scene.background = new THREE.CubeTextureLoader().load([
            require('@/assets/img/right.jpg'),
            require('@/assets/img/left.jpg'),
            require('@/assets/img/top.jpg'),
            require('@/assets/img/bottom.jpg'),
            require('@/assets/img/front.jpg'),
            require('@/assets/img/back.jpg'),
        ])
        // 添加相机
        const domCtn:any = document.getElementById("musicId")
        const width:number = domCtn.offsetWidth
        const height:number = domCtn.offsetHeight
        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000)
        this.camera.position.set(200, 200, 800)
        this.camera.lookAt(this.Scene.position)

        // 渲染器
        this.webGLRenderer = new THREE.WebGLRenderer({antialias: true})
        this.webGLRenderer.setSize(width, height)
        domCtn.appendChild(this.webGLRenderer.domElement)

        // 初始化坐标轴
        this.initAxesHelper()

        // 初始化控制器
        this.initControls()

        // 创建音频显示分组
        this.addAudioGroup(100, 128)

        // 创建音频线分组
        this.addAudioLines(100, 256)

        // 随机三角形分组
        this.addTriangleGroup()

        // 加载音频监听器
        this.addListener()

        // 初始化环境光和平行光
        this.initLight()

        // 定时渲染
        const renderTimer = () => {
            this.webGLRenderer.render(this.Scene, this.camera)
            requestAnimationFrame(renderTimer)
            if (this.analyser) {

            }
            const Delta = this.threeClock.getDelta()
            this.triangleArr.map((item:any) => {
                item.transition(Delta)
            })
        } 
        renderTimer()

        // 初始化FPS显示
        this.initStats()
    }

    // FPS显示
    initStats(){
        const stats:any = new Stats()
        stats.domElement.style.top = '40px';
        document.getElementById('homeCtn')?.appendChild(stats.dom)
    }

    // 初始化辅助坐标轴
    initAxesHelper(){
        this.Scene.add(new THREE.AxesHelper(500))
    }

    // 初始化控制器
    initControls(){
        this.controls = new OrbitControls(this.camera, this.webGLRenderer.domElement)
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        this.controls.enableDamping = true
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        this.controls.dampingFactor = 0.25
        //是否可以缩放
        this.controls.enableZoom = true
        //是否自动旋转
        this.controls.autoRotate = true
        //设置相机距离原点的最远距离
        this.controls.minDistance = 1;
        //设置相机距离原点的最远距离
        this.controls.maxDistance = 200;
        //是否开启右键拖拽
        this.controls.enablePan = false;
    }

    // 环境光，平行光
    initLight(){
        this.Scene.add(new THREE.AmbientLight(0x444444))
        const light = new THREE.PointLight(0xffffff)
        light.position.set(80, 100, 50)
        light.castShadow = true
        this.Scene.add(light)
    }

    // 添加监听
    addListener(){
        this.linstener = new THREE.AudioListener()
        this.camera.add(this.linstener)
        this.audio = new THREE.Audio(this.linstener)
        this.audioLoader = new THREE.AudioLoader()
        this.audioLoader.load(m79621, (AudioBuffer: any) => {
            if (this.audio.isPlaying) {
                this.audio.stop()
                this.audio.setBuffer()
            }
            this.audio.setBuffer(AudioBuffer)   // 音频缓冲区对象关联到音频对象audio
            this.audio.setLoop(false)           //是否循环
            this.audio.setVolume(1)           //音量
            this.audio.play()                   //播放
            // 音频分析器和音频绑定，可以实时采集音频时域数据进行快速傅里叶变换
            this.analyser = new THREE.AudioAnalyser(this.audio, 512)
        })
    }

    // 音频柱子
    addAudioGroup(R:number, N:number){
        this.audioBarGroup = new THREE.Group()
        for (let i = 0; i < N; i++) {
            const minGroup = new THREE.Group()
            const boxGeo = new THREE.BoxGeometry(1,1,1)
            const material = new THREE.MeshPhongMaterial({
                color:0x00ffff
            })
            const mesh = new THREE.Mesh(boxGeo, material)
            mesh.position.y = 0.5
            minGroup.add(mesh)
            minGroup.position.set(
                Math.sin(((i * Math.PI) / N) * 2) * R,
                Math.cos(((i * Math.PI) / N) * 2) * R,
                0
            )
            minGroup.rotation.z = ((-i * Math.PI) / N) * 2
            this.audioBarGroup.add(minGroup)
        }
        this.Scene.add(this.audioBarGroup)
    }

    // 音频线
    addAudioLines(R:number, N:number){
        this.barNodes = range(0, N).map(item => new node(
            R,
            ((item / N) * 360 + 45) % 360,
            new THREE.Vector2(0, 0)
        ))
        const lineMaterial = new THREE.LineBasicMaterial({
            color:0x00ffff
        })
        this.barLines = range(0, N).map(item => new THREE.Line(
            new THREE.BufferGeometry().setAttribute(
                'position',
                this.renderGeometries([
                    this.barNodes[item].positionA(),
                    this.barNodes[item].positionB(),
                ])
            ),
            lineMaterial
        ))
        this.outLine = new THREE.Line(
            new THREE.BufferGeometry().setAttribute(
                'position',
                this.renderGeometries(this.barNodes.map(node => node.positionA()))
            ),
            lineMaterial
        )
        this.inLine = new THREE.Line(
            new THREE.BufferGeometry().setAttribute(
                'position',
                this.renderGeometries(this.barNodes.map(node => node.positionB()))
            ),
            lineMaterial
        )

        this.linesGroup = new THREE.Group()
        this.linesGroup.add(this.outLine)
        this.linesGroup.add(this.inLine)
        this.barLines.map(item => {
            this.linesGroup.add(item)
        })
        this.Scene.add(this.linesGroup)

    }

    renderGeometries(vertices:Array<any>){
        const res:Array<any> = []
        vertices = vertices.concat(vertices[0])
        vertices.map(item => {
            res.push(item.x, item.y, 0)
        })
        return new THREE.BufferAttribute(new Float32Array(res), 3)
    }

    // 随机三角形
    addTriangleGroup(){
        this.triangleGroup = new THREE.Group()
        setInterval(() => {
            const material = new THREE.MeshBasicMaterial({
                color: 0x03a9f4
            })
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x03a9f4
            })
            const triangle = this.makeTriangle(material, lineMaterial, (data:any) => {
                this.triangleArr = this.triangleArr.filter(item => item !== data)
                this.triangleGroup.remove(data.group)
            })
            this.triangleGroup.add(triangle.group)
            this.triangleArr.push(triangle)
        }, 500)
        this.Scene.add(this.triangleGroup)
    }

    makeTriangle(material:any, lineMaterial:any, cb:any){
        return new Triangle(
            100,
            new THREE.Vector3(0, 0, 0),
            Math.random() * 360,
            randomRange(5, 1),
            randomRange(0.1, 0.05),
            material,
            lineMaterial,
            {
                startShow: 15,
                endShow: 30,
                startHide: 60,
                endHide: 70
            },
            cb
        )
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