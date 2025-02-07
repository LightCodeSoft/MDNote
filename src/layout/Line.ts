import Elem from "./Elem";
import Box, { BoxCfg } from "./Box"
import Mouse from "../tools/Mouse"

export default class Line extends Box {
    line: Elem;
    constructor(isHorizon: boolean,
        onDrag: (dx: number, dy: number, lastX: number, lastY: number) => void,
        onBeginDrag: (x: number, y: number) => void,
        width: number = 2) {
        super(BoxCfg.newWithWidth(width), null, isHorizon ? "hline" : "vline")
        this.line = new Elem("div");
        if (isHorizon) {
            this.line.height(4);
        } else {
            this.line.width(4);
        }
        this.addChild(this.line);
        let cursor = isHorizon ? "ns-resize" : "e-resize";
        let self = this;
        new Mouse(this.line, cursor, "__pyui_line_draging").addDrag(onDrag, true, false, onBeginDrag);
    }
}