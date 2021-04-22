import { Vector2 } from 'three'

export default class Node {
    lastStrength = 0;
    theStrength = 0;
    targetRange = 0;
    _range = 0;
    baseRange
    angle
    center
   constructor(baseRange:number, angle:number, center:any) {
     this.baseRange = baseRange;
     this.angle = angle;
     this.center = center;
   }
   positionA() {
 
     const range = this._range + this.baseRange;
     const x = Math.cos(this.angle * Math.PI / 180) * range;
     const y = Math.sin(this.angle * Math.PI / 180) * range;
     return new Vector2(this.center.x + x, this.center.y + y);
   }
   positionB() {
     const range = this._range * -1 + this.baseRange;
     const x = Math.cos(this.angle * Math.PI / 180) * range;
     const y = Math.sin(this.angle * Math.PI / 180) * range;
     return new Vector2(this.center.x + x, this.center.y + y);
   }
   strength(newStrength:any) {
     this.lastStrength = this.theStrength;
     this.theStrength = newStrength;
     this.targetRange = Math.max(this.theStrength - this.lastStrength, 0);
     if (this.targetRange > this._range) this._range = this.targetRange;
   }
   transition(delay:any) {
     this._range = Math.max(this._range - delay * this._range * 5, 0);
   }
}