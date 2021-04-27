<template>
    <div class='home' id="homeCtn">
        <div id="musicId" style="width:100%; height:100%"></div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import * as THREE from 'three'
const OrbitControls = require("three-orbitcontrols")
const m79621 = require("@/assets/mp3/79621.mp3")
const m875689 = require("@/assets/mp3/875689.mp3")
import { getCiclePoints, randomRange, range } from '@/util/util'
import Triangle from '@/components/commom/base-component/triangle'
import node from '@/components/commom/base-component/node'
const Stats = require('stats-js')

@Component
export default class Music3D extends Vue{

    @State("musicModule") musicModule:any
    @Mutation('set_musicCurrentTime') set_musicCurrentTime: any
    @Mutation('set_musicMaxTime') set_musicMaxTime: any

    @Prop() TriangleColors:any
    @Prop() barColors:any
    @Prop() linesColors:any
    @Prop() autoRotate:any

    @Watch('linesColors')
    watchLinesColors(newval:any, oldval:any){
        if (newval && newval !== oldval) {
            this.linesGroup.traverse((item:any) => {
                if (item.isLine) {
                    item.material = new THREE.LineBasicMaterial({
                        color: Number('0x' + newval.slice(1))
                    })
                }
            })
        }
    }

    @Watch('barColors')
    watchBarColors(newval:any, oldval:any){
        if (newval && newval !== oldval) {
            this.audioBarGroup.traverse((item:any) => {
                console.log()
                if (item.type === "Mesh") {
                    item.material = new THREE.LineBasicMaterial({
                        color: Number('0x' + newval.slice(1))
                    })
                }
            })
        }
    }
    @Watch('autoRotate')
    watchAutoRotate(newval:boolean){
        if (this.controls) {
            this.controls.autoRotate = newval
        }
    }

    private Scene:any = null            // 场景
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
    private threeClock:any = new THREE.Clock()  // three计时
    private barNodes:Array<any> = []    // 音频柱状节点
    private barLines:Array<any> = []    // 音频线
    private outLine:any = null          // 音频外线
    private inLine:any = null           // 音频内线
    private linesGroup:any = null       // 音频线分组
    private stats:any = null            // FPS查看器
    private scale:number = 1            // 变化幅度

    mounted(){
        this.renderFunc()
        window.addEventListener('resize',this.windowResize)
    }

    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize)   
    }

    activated(){

    }

    // 设置播放进度
    setPlayCurrentTime(val:number){
        if (this.audio) {
            console.log(this.audio)
            console.log(this.audio.context)
            // this.audio.context.setContext({currentTime:val})
        }
    }

    // 播放/暂停
    handleAudioPlay(flag:boolean){
        if (this.audio) {
            console.log(this.audio.context)
            flag ? this.audio.context.resume() : this.audio.context.suspend()
        }
    }

    windowResize(){
        if (this.camera) {
            const domCtn:any = document.getElementById("musicId")
            const width:number = domCtn.offsetWidth
            const height:number = domCtn.offsetHeight
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
            this.webGLRenderer.setSize(width, height)
        }
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
        this.camera.position.set(0, 0, 400)
        this.camera.lookAt(this.Scene.position)

        // 渲染器
        this.webGLRenderer = new THREE.WebGLRenderer({antialias: true})
        this.webGLRenderer.setSize(width, height)
        domCtn.appendChild(this.webGLRenderer.domElement)

        // 初始化坐标轴
        // this.initAxesHelper()

        // 初始化FPS显示
        // this.initStats()

        // 初始化控制器
        this.initControls()

        // 创建音频显示分组
        this.addAudioGroup(100, 128)

        // 创建音频线分组
        this.addAudioLines(80, 256)

        // 随机三角形分组
        this.addTriangleGroup()

        // 加载音频监听器
        this.addListener()

        // 初始化环境光和平行光
        this.initLight()

        // 定时动态渲染
        this.animate()
    }

    // 动态渲染
    animate(){
        this.stats && this.stats.update()
        this.controls.update()
        const Delta = this.threeClock.getDelta()
        if (this.analyser) {
            const currentTime = this.audio.context.currentTime
            if (Math.floor(currentTime) !== this.musicModule.musicCurrentTime) {
                this.set_musicCurrentTime(Math.floor(currentTime))
            }
            const arr:Array<any> = this.analyser.getFrequencyData()
            if (this.audioBarGroup) {
                this.audioBarGroup.rotation.z += 0.002
                this.audioBarGroup.scale.set(this.scale, this.scale, this.scale)
                this.audioBarGroup.children.map((item:any,index:number) => {
                    // item.children[0].material.color.r = arr[index] / 100 * 3
                    // item.children[0].material.color.g = arr[index] / 150 * 3
                    // item.children[0].material.color.b = arr[index] / 50 * 3
                    if (arr[index] === 0) {
                        item.scale.set(0, 0, 0)
                    } else {
                        let m = arr[index] / 10
                        const targetRange = Math.max(arr[index] / 20 - arr[index - 1] / 20, 0)
                        m < targetRange ? m = targetRange : null
                        item.scale.set(1, m, 1)
                    }
                })
            }
            
            this.barNodes.forEach((node:any, index:number, array:Array<any>) => {
                node.strength(arr[index % array.length] * 0.1)
                node.transition(Delta)
            })
            this.scale = 1 + arr[Math.ceil(arr.length * 0.05)] / 500
            this.updateCircle(arr)
        }
        this.triangleArr.map((item:any) => {
            item.transition(Delta)
        })
        this.webGLRenderer.render(this.Scene, this.camera)
        requestAnimationFrame(this.animate)
    }

    updateCircle(arr:Array<any>){
        if (this.barNodes) {
            this.linesGroup.scale.set(this.scale, this.scale, this.scale)
            const geometryA = this.outLine.geometry
            const attributeA = geometryA.getAttribute('position')
            const geometryB = this.inLine.geometry
            const attributeB = geometryB.getAttribute('position')
            const positions = this.barNodes.map(item => [item.positionA(), item.positionB()])

            positions.map((item, index) => {
                attributeA.set([item[0].x, item[0].y], index * 3)
                attributeB.set([item[1].x, item[1].y], index * 3)
                const geometry = this.barLines[index].geometry
                const attribute = geometry.getAttribute('position')
                attribute.set([item[0].x, item[0].y, 0, item[1].x, item[1].y, 0], 0)
                attribute.needsUpdate = true
            })
            attributeA.set(
                [attributeA.array[0], attributeA.array[1]],
                positions.length * 3
            );
            attributeB.set(
                [attributeB.array[0], attributeB.array[1]],
                positions.length * 3
            );
            attributeA.needsUpdate = true;
            attributeB.needsUpdate = true;
        }
    }

    // FPS显示
    initStats(){
        this.stats = new Stats()
        this.stats.domElement.style.top = '40px';
        document.getElementById('homeCtn')?.appendChild(this.stats.dom)
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
        this.controls.autoRotate = !!this.autoRotate
        //设置相机距离原点的最远距离
        this.controls.minDistance = 1;
        //设置相机距离原点的最远距离
        this.controls.maxDistance = 800;
        //是否开启右键拖拽
        this.controls.enablePan = false;
    }

    // 环境光，平行光
    initLight(){
        this.Scene.add(new THREE.AmbientLight(0x444444))
        const light = new THREE.PointLight(0xffffff)
        light.position.set(80, 100, 50)
        light.castShadow = true
        const light2 = new THREE.PointLight(0xffffff)
        light2.position.set(-80, -100, -50)
        light2.castShadow = true
        this.Scene.add(light)
        this.Scene.add(light2)
    }

    // 添加监听
    addListener(){
        this.linstener = new THREE.AudioListener()
        this.camera.add(this.linstener)
        this.audio = new THREE.Audio(this.linstener)
        this.audio.context.suspend()        // 暂停音频播放
        this.audioLoader = new THREE.AudioLoader()
        this.audioLoader.load(m79621, (AudioBuffer: any) => {
            if (this.audio.isPlaying) {
                this.audio.stop()
                this.audio.setBuffer()
            }
            this.audio.setBuffer(AudioBuffer)   // 音频缓冲区对象关联到音频对象audio
            this.audio.setLoop(false)           // 是否循环
            this.audio.setVolume(1)             // 音量
            this.audio.play()                   // 播放
            this.set_musicMaxTime(Math.floor(this.audio.buffer.duration))
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
                color:Number('0x' + this.barColors.slice(1))
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
            color: Number('0x' + this.linesColors.slice(1))
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
                color: Number('0x' + this.TriangleColors.slice(1))
            })
            const lineMaterial = new THREE.LineBasicMaterial({
                color: Number('0x' + this.TriangleColors.slice(1))
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
            30,
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