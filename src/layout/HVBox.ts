import Box, { BoxCfg } from "./Box"
import Line from "./Line"
import Elem from "./Elem";
import { Size } from "../tools/Geometry";

export class HVBox extends Box {
    lineWidth: number;
    usedByfixed: number = 0;
    weights: number[] = [];//记录宽度占比权重,如果固定的为0,包含line
    isHor: boolean;
    downCtx = {//点击时的值
        preW: 0,//权重
        nextW: 0,//权重
        prePix: 0,//像素
        nextPix: 0,//像素
        totalMul: 0,
        remainPix: 0//剩余空间大小
    };
    constructor(isHor: boolean, cfg: BoxCfg, className: null | string[] | string = null, splitLineWidth = 2) {
        super(cfg, className, isHor ? "hbox" : "vbox");
        this.lineWidth = splitLineWidth;
        this.isHor = isHor;
    }

    addLineIfNeed() {
        let addline = false;
        if (this.c.length > 0) {
            let lastChild = this.c[this.c.length - 1] as Box;
            addline = this.isHor ? lastChild.cfg.isWResizable : lastChild.cfg.isHResizable;
        }
        if (addline) {
            let self = this;
            let childIdx = self.c.length;

            function onBeginDrag(dx, dy) {
                self.onBeginDrag(childIdx, dx, dy);
            }
            function onDrag(dx, dy, lastX, lastY) {
                self.onDrag(childIdx, dx, dy, lastX, lastY);
            }
            let line = new Line(!this.isHor, onDrag, onBeginDrag, this.lineWidth);
            super.addChild(line)
            this.weights.push(0);//用于占位
        }
    }
    cptWeights() {//对所有的孩子进行计算
        this.usedByfixed = 0;
        let totalWeights = 0;
        let unknowIdxs = [];

        for (var i = 0; i < this.c.length; ++i) {
            let box = this.c[i] as Box;
            let wOrH = this.isHor ? box.cfg.width : box.cfg.height;
            if (wOrH >= 0) {
                this.usedByfixed += wOrH
            } else {
                totalWeights += box.cfg.weight;
                unknowIdxs.push(i);
            }
        }
        //未设定weight的box
        for (var i = 0; i < unknowIdxs.length; ++i) {
            let idx = unknowIdxs[i]
            let box = this.c[idx] as Box;
            let w = totalWeights > 0 ? (box.cfg.weight / totalWeights) : 0
            this.weights[idx] = w;
        }

    }
    setWeights() {//对所有的孩子进行设置
        // console.log("============set weights=============")
        for (var i = 0; i < this.c.length; ++i) {
            let w = this.weights[i];
            let box = this.c[i] as Box;
            // let resizable = this.isHor ? lastChild.cfg.isWResizable : lastChild.cfg.isHResizable;
            // let fixedV = this.getFixed(i);
            let wOrH = this.isHor ? box.cfg.width : box.cfg.height;
            // console.log(i, wOrH, w, box)
            if (wOrH < 0) {//按weight占比填充剩余空间
                let css = `calc(${w * 100}% - ${this.usedByfixed * w}px)`;
                this.setWeight(i, css);
            }
            else {//固定值
                this.setWeight(i, wOrH);
            }
        }
    }
    rerender(){
        this.cptWeights();
        this.setWeights();
    }
    addChild(c: string | Elem | HTMLElement): Elem {//入口1
        if (!(c instanceof Box)) {
            throw "Only the instance of Box is valid param !";
        }
        let resizable = this.isHor ? (c as Box).cfg.isWResizable : (c as Box).cfg.isHResizable;
        if (resizable)//先确保当前是可resize的
            this.addLineIfNeed();
        this.weights.push(0);//占位
        super.addChild(c);
        this.cptWeights();
        this.setWeights();
        // console.log("childs==>", this.c)
        return this;
    }
    /**
     *  childIdx: line在所有child的索引
    */
    onDrag(childIdx, dx, dy, lastX, lastY) {//拖拽
        let c1 = this.c[childIdx - 1] as Box;
        let c2 = this.c[childIdx + 1] as Box;
        let pixDelta = this.isHor ? dx : dy;

        let c1ToPix = this.downCtx.prePix + pixDelta
        let c2ToPix = this.downCtx.nextPix - pixDelta

        let c1MinPix = this.isHor ? c1.cfg.minWidth : c1.cfg.minHeight;
        let c2MinPix = this.isHor ? c2.cfg.minWidth : c2.cfg.minHeight;
        c1MinPix = c1MinPix < 1 ? 1 : c1MinPix;
        c2MinPix = c1MinPix < 1 ? 1 : c1MinPix;

        if (c1ToPix < c1MinPix && c2ToPix < c2MinPix)
            return;//左右都比最小值要小，直接返回，不做任何处理
        if (c1ToPix < c1MinPix) {
            pixDelta = c1MinPix - this.downCtx.prePix;
            c1ToPix = c1MinPix;
        }
        if (c2ToPix < c2MinPix) {
            pixDelta = c2MinPix - this.downCtx.nextPix;
            c2ToPix = c2MinPix;
        }
        if (pixDelta == 0) return;//没移动，跳出


        let isC1Fill = this.isHor ? c1.cfg.width < 0 : c1.cfg.height < 0;
        let isC2Fill = this.isHor ? c2.cfg.width < 0 : c2.cfg.height < 0;
        // console.log(isC1Fill, isC2Fill)
        // console.log(!isC1Fill && isC2Fill, isC1Fill && !isC2Fill)


        if (isC1Fill && isC2Fill) {//都是填充
            let remains = this.isHor ? this.width() as number - this.usedByfixed : this.height() as number - this.usedByfixed;
            c1.cfg.weight = c1ToPix / remains;
            c2.cfg.weight = c2ToPix / remains;
        } else if (!isC1Fill && isC2Fill) {//左具体，右填充
            c2.cfg.weight = (c2ToPix / this.downCtx.nextPix) * c2.cfg.weight;
            if (this.isHor) {
                c1.cfg.width = c1ToPix;
            }
            else {
                c1.cfg.height = c1ToPix;
            }
        } else if (isC1Fill && !isC2Fill) {//左填充，右具体
            c1.cfg.weight = (c1ToPix / this.downCtx.prePix) * c2.cfg.weight;
            if (this.isHor) {
                c2.cfg.width = c1ToPix;
            }
            else {
                c2.cfg.height = c1ToPix;
            }

        } else {//都是具体值
            if (this.isHor) {
                c1.cfg.width = c1ToPix;
                c2.cfg.width = c2ToPix;
            } else {
                c1.cfg.height = c1ToPix;
                c2.cfg.height = c2ToPix;
            }
        }

        // //pix
        // let firstPix = this.downCtx.prePix + pixDelta;
        // let secondPix = this.downCtx.nextPix - pixDelta;
        // //weight
        // let flexDelta = pixDelta / this.downCtx.totalMul;
        // let firstW = this.downCtx.preW + flexDelta;
        // let secondW = this.downCtx.nextW - flexDelta;
        // //防止小于0
        // let minW1 = c1.minWeight >= 0 ? c1.minWeight : 0;
        // let minW2 = c2.minWeight >= 0 ? c2.minWeight : 0;
        // //如果设了minPix则要看一下minPix是否允许通过, 后面false表示pix这块没放行，否则就是可以任意拖动了，因为pix<0时，永远通行
        // let passFirst = c1.minPix >= 0 ? (firstPix > c1.minPix) : false;
        // passFirst = passFirst || (firstW > minW1);

        // let passSecond = c2.minPix >= 0 ? (secondPix > c2.minPix) : false;
        // passSecond = passSecond || (secondW > minW2);

        // if (!passFirst || !passSecond)
        //     return;

        // this.weights[childIdx - 1] = firstW;
        // this.weights[childIdx + 1] = secondW;
        this.cptWeights()
        this.setWeights()
        this.recordLastState(childIdx)
    }
    recordLastState(childIdx) {
        let preV = 0, nextV = 0;
        if (this.isHor) {
            preV = this.c[childIdx - 1].width() as number;
            nextV = this.c[childIdx + 1].width() as number;
        } else {
            preV = this.c[childIdx - 1].height() as number;
            nextV = this.c[childIdx + 1].height() as number;
        }
        this.downCtx = {
            preW: this.weights[childIdx - 1],
            nextW: this.weights[childIdx + 1],
            prePix: preV,
            nextPix: nextV,
            totalMul: (preV + nextV) * (this.weights[childIdx - 1] + this.weights[childIdx + 1]),
            remainPix: (this.width() as number) - this.usedByfixed
        }
    }
    onBeginDrag(childIdx, x, y) {//入口2
        this.recordLastState(childIdx);
        // let preV = 0, nextV = 0;
        // if (this.isHor) {
        //     preV = this.c[childIdx - 1].width() as number;
        //     nextV = this.c[childIdx + 1].width() as number;
        // } else {
        //     preV = this.c[childIdx - 1].height() as number;
        //     nextV = this.c[childIdx + 1].height() as number;
        // }
        // this.downCtx = {
        //     preW: this.weights[childIdx - 1],
        //     nextW: this.weights[childIdx + 1],
        //     prePix: preV,
        //     nextPix: nextV,
        //     totalMul: (preV + nextV) * (this.weights[childIdx - 1] + this.weights[childIdx + 1]),
        //     remainPix: (this.width() as number) - this.usedByfixed
        // }
    }
    setWeight(idx, w) {
        throw "unimplemented method!"
    }
    getFixed(idx): number {
        throw "unimplemented method!"
    }
    getMySize() {//返回当前box的大小（宽或高）
        throw "unimplemented method!"
    }
}
export class HBox extends HVBox {
    constructor(cfg: BoxCfg, className: null | string[] | string = null, splitLineWidth = 2) {
        super(true, cfg, className, splitLineWidth)
    }
    setWeight(idx, w) {
        this.c[idx].width(w);
        this.c[idx].height("100%");
    }
    getFixed(idx): number {
        return (this.c[idx] as Box).cfg.width;
    }
    getMySize() {
        return this.width();
    }
}
export class VBox extends HVBox {
    constructor(cfg: BoxCfg, className: null | string[] | string = null, splitLineWidth = 2) {
        super(false, cfg, className, splitLineWidth)
    }
    setWeight(idx, w) {
        this.c[idx].height(w);
        this.c[idx].width("100%");
    }
    getFixed(idx): number {
        return (this.c[idx] as Box).cfg.height;
    }
    getMySize() {
        return this.height();
    }
}