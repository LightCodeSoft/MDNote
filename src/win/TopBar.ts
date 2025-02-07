
import Box, { BoxCfg } from "../layout/Box"
import Elem from "../layout/Elem"
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { sendEvt } from "../tools/EvtMngr"
import * as Const from "../tools/Const"

const _items = [
    { "n": "文件", c: [{ n: "打开", t: "openDir" }, { n: "退出", t: "exit" }] },
    { "n": "标题", c: [{ n: "一级标题", t: "h1" }, { n: "二级标题", t: "h2" }, { n: "三级标题", t: "h3" }, { n: "四级标题", t: "h4" }, { n: "五级标题", t: "h5" }] },
    { "n": "段落", c: [{ n: "加粗", t: 'bold' }, { n: "斜体", t: 'italic' }, { n: "删除", t: 'del' }, { n: "引用", t: "blockquote" }] },
    { "n": "图表", c: [{ n: "图片", t: "img" }, { n: "表格", t: "table" }] },
    { "n": "列表", c: [{ n: "有序", t: 'li' }, { n: "无序", t: 'ul' }, { n: "任务", t: "task" }] },
    { "n": "代码", c: [{ n: "行内代码", t: "inline-code" }, { n: "多行代码块", t: "block-code" }, { n: "Python", t: "python" }, { n: "Bash", t: "bash" }, { n: "C++", t: "cpp" }, { n: "Java", t: "java" }, { n: "Javascript", t: "js" }, { n: "Json", t: "json" }, { n: "YAML", t: "yaml" }, { n: "HTML", t: "html" }, { n: "XML", t: "xml" }] },
    { "n": "绘图", c: [{ n: "流程图", t: "flow" }, { n: "时序图", t: "seq" }] },
    {
        "n": "公式", c: [{ n: "上下标", t: "updown" }, { n: "分数", t: "frac" }, { n: "开根", t: "sqrt" }, { n: "矩阵", t: "matrix" },
        { n: "数学表格", t: "mathTable" }, { n: "行列式", t: "vmatrix" }, { n: "顶部符号", t: "hat" }, { n: "分类表达式", t: "mathCls" },
        { n: "关系运算符", t: "symbolRel" }, { n: "集合运算符", t: "symbolSet" }]
    } ]

export default class TopBar extends Box implements OnSwitchModuleListener {
    constructor() {
        super(BoxCfg.newWithHeight(35), "topBar", "ul")
        this.initNav(this, _items)
        registerClickSwitch(this)
    }
    initNav(root: Elem, items: any[]) {
        let self = this;
        items.forEach(function (item) {
            let e = new Elem("li");
            let label = new Elem("label")
            label.innerChild(item.n);
            e.addChild(label)
            if (item.c) {
                let child = new Elem("ul")
                self.initNav(child, item.c);
                e.addChild(child);
                e.hover(function () { child.show() }, function () { child.hide() })
            }
            if (item.t)
                e.setOnClickListener(function () { self.onClickItem(item.t); root.hide() })
            root.addChild(e)
        })
    }
    onClickItem(t) {
        sendEvt(Const.EditCommand, t)
    }
    isSelected() {
        throw new Error("Method not implemented.");
    }
    onSwitchChange(isFocus): void {
    }
    getTar(): HTMLElement {
        return this.o;
    }
}