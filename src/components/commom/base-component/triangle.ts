import * as THREE from 'three'
import { randomRange } from '@/util/util'

export default class Triangle {
  rotate: any = Math.random() * 360        // 旋转角度
  id: any = new Date().valueOf()           // id
  distance: any                            // 距离
  rotateSpeed: any                         // 旋转速度
  angle: any                               // 角度
  speed: any                               // 速度
  center: any                              // 中心点
  mesh: any                                // 网格
  showDistance: any                        // 显示距离
  panelMaterial: any                       // 面板材料
  lineMaterial: any                        // 边线材料
  panelOpacity: any = 0.1                  // 面板材质透明度
  line: any                                // 线
  group: any                               // 分组
  onDelete: any                            // 是否删除
  
  constructor(
    size: any,
    center: any,
    angle: any,
    speed: any,
    rotateSpeed: any,
    material: any,
    lineMaterial: any,
    lineDistance: any,
    cb: any
  ) {
    this.rotateSpeed = rotateSpeed
    this.angle = angle
    this.speed = speed
    this.center = center
    this.onDelete = cb
    this.distance = lineDistance.startShow
    this.showDistance = lineDistance
    this.panelMaterial = new THREE.MeshBasicMaterial().copy(material)
    this.panelMaterial.transparent = true
    this.lineMaterial = new THREE.LineBasicMaterial().copy(lineMaterial)
    this.lineMaterial.transparent = true
    const panelGeometry: any = new THREE.BufferGeometry();
    const lineGeometry: any = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // x y z 确定一个空间点
      // 第一个点
      randomRange(size, size / 2),
      randomRange(size, size / 2),
      randomRange(size, size / 2),
      // 第二个点
      randomRange(size, size / 2),
      randomRange(size, size / 2),
      randomRange(size, size / 2),
      // 第三个点
      randomRange(size, size / 2),
      randomRange(size, size / 2),
      randomRange(size, size / 2),
    ])
    const normals = new Float32Array([
      0, 0, 1, //顶点1法向量
      0, 0, 1, //顶点2法向量
      0, 0, 1, //顶点3法向量
      0, 1, 0, //顶点4法向量
      0, 1, 0, //顶点5法向量
      0, 1, 0, //顶点6法向量
    ])
    panelGeometry.attributes.position = new THREE.BufferAttribute(vertices, 3)
    panelGeometry.attributes.normal = new THREE.BufferAttribute(normals, 3)
    lineGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array([...vertices, ...vertices.slice(0,3)]), 3)
    lineGeometry.attributes.normal = new THREE.BufferAttribute(normals, 3)
    this.line = new THREE.Line(lineGeometry, this.lineMaterial)
    this.mesh = new THREE.Mesh(panelGeometry, this.panelMaterial)
    this.group = new THREE.Group()
    this.translateOnAxis(this.translate(this.distance), 1)
    this.group.add(this.line)
    this.group.add(this.mesh)
    this.rotateZ(this.rotate)
    this.updatePosition(0)
  }

  translate(distance: any) {
    const x = Math.cos((this.angle * Math.PI) / 180) * distance;
    const y = Math.sin((this.angle * Math.PI) / 180) * distance;
    const z = (Math.cos((this.angle * Math.PI) / 360) * distance * this.angle) / 180;
    return new THREE.Vector3(x, y, z);
  }

  translateOnAxis(axis: any, distance: any) {
    this.group.translateOnAxis(axis, distance)
  }

  rotateZ(angle: any) {
    this.mesh.geometry.rotateZ(angle)
    this.line.geometry.rotateZ(angle)
  }

  updatePosition(delay: any) {
    this.translateOnAxis(this.translate(delay * this.speed), 1)
    this.distance += delay * this.speed
    this.rotateZ(this.rotateSpeed * delay)
    this.panelMaterial.opacity = this.opacity(this.distance, this.showDistance) * this.panelOpacity;
    this.lineMaterial.opacity = this.opacity(this.distance, this.showDistance)
    if (this.distance > this.showDistance.endHide) {
      this.delete()
    }
  }

  delete() {
    this.onDelete(this);
    this.mesh.geometry.dispose();
    this.line.geometry.dispose();
  }

  opacity(distance: any, showDistance: any) {
    if (this.distance < showDistance.endShow) {
      return (
        (this.distance - showDistance.startShow) /
        (showDistance.endShow - showDistance.startShow)
      );
    } else if (this.distance > showDistance.startHide) {
      return (
        (showDistance.endHide - this.distance) /
        (showDistance.endHide - showDistance.startHide)
      );
    } else {
      return 1;
    }
  }

  transition(delay: any) {
    this.updatePosition(delay);
  }
}