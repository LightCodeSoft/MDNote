import Elem from "./Elem";

export class BoxCfg {
    public width: number = -1; //-1表示填充剩余空间， >=0表示具体
    public height: number = -1; //-1表示填充剩余空间, >=0表示具体
    public weight: number = 1;//填充剩余空间时，占的权重
    public minWidth: number = 0;//最小宽度
    public minHeight: number = 0;//最小高度
    public isWResizable: boolean = false;//宽度是否固定，即是否不允许鼠标拖拉宽度
    public isHResizable: boolean = false;//高度是否固定，即是否不允许鼠标拖拉高度
    constructor(width = -1, height = -1, minWidth = 0, minHeight = 0, weight = 1, isWResizable = false, isHResizable = false) {
        this.width = width;
        this.height = height;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.weight = weight;
        this.isHResizable = isHResizable;
        this.isWResizable = isWResizable;
    }
    setWidth(width) {
        this.width = width;
        if (width >= 0)//固定的值一定要设置好weight为0
            this.weight = 0;
        return this;
    }
    setHeight(height) {
        this.height = height;
        if (height >= 0)//固定的值一定要设置好weight为0
            this.weight = 0;
        return this;
    }
    setWResizable(isWResizable) {
        this.isWResizable = isWResizable;
        return this;
    }
    setWeight(weight) {
        this.weight = weight;
        return this;
    }
    static newWithHeight(height) {
        return new BoxCfg().setHeight(height);
    }

    static newWithWidth(width) {//宽度固定，高度100%
        return new BoxCfg().setWidth(width);
    }
}
export default class Box extends Elem {
    // public fixedW: number; //如果>=0则表示不能变化
    // public fixedH: number; //如果>=0则表示不能变化

    //Pix与Weight取实际情况中的最小值
    // public minWeight: number;// 权重（宽或高，根据实际情况）最小值
    // public defaultWeight: number;// 权重（宽或高，根据实际情况）默认值
    // public minPix: number; //具体尺寸（宽或高，根据实际情况）最小值
    // public defaultPix: number; //具体尺寸（宽或高，根据实际情况）默认值
    cfg: BoxCfg;
    constructor(cfg: BoxCfg | null = null, className: null | string[] | string = null, tagName: string = "box") {
        super(tagName, className);
        cfg = cfg == null ? new BoxCfg() : cfg;
        this.cfg = cfg;
        if (cfg.width > 0) {
            this.width(cfg.width);
        }
        if (cfg.height > 0) {
            this.height(cfg.height);
        }
        // this.minWeight = minWeight;
        // this.fixedW = fixedW;
        // this.fixedH = fixedH;
        // this.minPix = minPix;
        // this.defaultPix = defaultPix;
        // this.defaultWeight = defaultWeight;
        // if (fixedH < 0 && fixedW < 0) {
        //     // this.setFlexWeight(this.defaultWeight);
        // }
        // else if (fixedW >= 0) {
        //     this.width(fixedW);
        // }
        // else if (fixedH >= 0)
        //     this.height(fixedH)
    }
}

