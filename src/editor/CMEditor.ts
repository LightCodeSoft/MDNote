import { CodeMirror } from "../codemirror/edit/main.js"
import { default as Box, BoxCfg } from "../layout/Box"
import initMDMode from "./utils/md_mode.js"
import { marked } from "./utils/marked.esm.js"
import Key, { OnKeyDownListener } from "../tools/Key"
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { EvtListener, registerEvt, sendEvt } from "../tools/EvtMngr.js"
import * as Const from "../tools/Const"
import { Pos } from "../codemirror/line/pos.js"

import { getLine, lineNo } from "../codemirror/line/utils_line.js"
import { lineStart } from "../codemirror/edit/commands.js"

let Native = window.Native;
import markedKatex from "./utils/katex_ext.js"
const options = {
    throwOnError: false,
    nonStandard: false
};

marked.use(markedKatex(options));


function renderCode(text, lang) {
    if (lang == "flow") {
        return `<div class="flowchart" flow-data="${text}"></div>`
    }
    else if (lang == "seq") {
        return `<div class="sequence-diagram" seq-data="${text}"></div>`
    }
    // return renderHighlight(text, lang)
    if (lang)
        return `<pre><code class="language-${lang}">${text}</code></pre>`
    else
        return `<pre><code  >${text}</code></pre>`
}
var renderer = new marked.Renderer();
renderer.code = function (code) {
    return renderCode(code.text, code.lang);
};
const seqDemo = `Andrew->China: Says Hello
Note right of China: China thinks\\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!`

const flowDemo = `st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op`
const tableDemo = `
| 左对齐 | 居中对齐 | 右对齐 |
| :--------- | :--: | -----------: |
| 1 | 1 | 1 |
| 22 | 22 | 22 |
| 333 | 333 | 333 |
`
const matrixDemo: string = `

$$
  \\begin{pmatrix}
  1 & a_1 & a_1^2 & \\cdots & a_1^n \\\\
  1 & a_2 & a_2^2 & \\cdots & a_2^n \\\\
  \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\
  1 & a_m & a_m^2 & \\cdots & a_m^n \\\\
  \\end{pmatrix}
$$

`
const mathTable = `

$$
\\begin {array}{c|lcr}
n & \\text{Left} & \\text{Center} & \\text{Right} \\\\
\\hline
1 & 0.24 & 1 & 125 \\\\
2 & -1 & 189 & -8 \\\\
3 & -20 & 2000 & 1+10i \\\\
\\end{array}
$$

`
const mathCls = `

$$
f(n) =
\\begin{cases}
n/2,  & \\text{if $n$ is even} \\\\
3n+1, & \\text{if $n$ is odd}  \\\\
\\end{cases}
$$

`
export default class CMEditor extends Box implements OnSwitchModuleListener, EvtListener {
    cm: any;
    isFocus = false;
    path: string = null;

    constructor(cfg: BoxCfg | null = null) {
        super(cfg, "mdeditRoot");
        let self = this;
        self.initEditor();
        registerClickSwitch(this)
        // Key.registerKeydown(this)
        registerEvt([Const.EditCommand, Const.OnKeydownSave], this)
    }
    onEvt(name: any, data: any) {
        if (name == Const.OnKeydownSave) {
            // sendEvt(Const.ReqSaveFile, { "path": this.path, "content": this.getContent(), "cb": data ? data.cb : null })
            let rs = Native.writeFile(this.path, this.getContent());
            data && data.cb && data.cb(rs)
            sendEvt(Const.OnSaveFile, this.path);
        } else if (name == Const.EditCommand) {
            this.onCommand(data);
        }
    }
    onCommand(t) {
        if (["openDir", "exit"].includes(t)) {
            this.cmdFile(t);
        }
        if (this.cfg.weight <= 0) return;
        if (["h1", "h2", "h3", "h4", "h5"].includes(t)) {
            this.cmdH(t);
        } else if (["inline-code", "block-code", "python", "bash", "cpp", "java", "js", "json", "yaml", "html", "xml"].includes(t)) {
            this.cmdCode(t)
        } else if (["seq", "flow"].includes(t)) {
            this.cmdChart(t)
        } else if (["img", "bold", "italic", "del", "blockquote", "table", "ul", "li", "task"].includes(t)) {
            this.cmdBasic(t)
        } else if (["updown", "frac", "matrix", "sqrt", "mathTable", "vmatrix", "hat", "mathCls", "symbolRel", "symbolSet"].includes(t)) {
            this.cmdMath(t)
        }
        this.cm.focus()
    }
    cmdFile(t) {
        if (t == "openDir") {
            let out = Native.openFileSelector("", false, true);
            if (out.length > 0) {
                sendEvt(Const.ReqOpenDir, { root: out[0], saveToCfg: true });
            }
        } else if (t == "exit") {
            Native.exitApp();
        }
    }
    cmdMath(t) {
        var content = "";
        if (t == "updown") {
            content = " $x_i^2$ "
        } else if (t == "frac") {
            content = " ${a+1\\over b+1}$ "
        } else if (t == "sqrt") {
            content = " $\\sqrt[4]{\\frac xy}$ "
        } else if (t == "matrix") {
            content = matrixDemo
        } else if (t == "mathTable") {
            content = mathTable;
        } else if (t == "vmatrix") {
            content = matrixDemo.replaceAll("pmatrix", "vmatrix")
        } else if (t == "hat") {
            content = "$ \\hat{x} \\overline{x} \\vec{x} \\overrightarrow{x} \\dot{x} \\ddot{x} $"
        } else if (t == "mathCls") {
            content = mathCls;
        } else if (t == "symbolRel") {
            content = "$ \\pm \\times \\div \\mid \\nmid \\cdot \\circ \\ast \\bigodot \\bigotimes \\bigoplus \\leq \\geq \\neq \\approx \\equiv \\sum \\prod \\coprod $";
        } else if (t == "symbolSet") {
            content = " $ \\forall \\complement \\therefore \\emptyset \\exists \\subset \\because \\empty \\exist \\supset \\mapsto \\varnothing \\nexists \\mid \\to \\implies \\in \\land \\gets \\impliedby \\isin \\lor \\leftrightarrow \\iff \\notin \\ni \\notni \\neg or \\lnot \\Set{ x | x<\\frac 1 2 } \\set{x|x<5} $\n"
            // content = "$ \\emptyset \\in \\notin \\subset \\supset \\subseteq \\supseteq \\bigcap \\bigcup \\bigvee \\bigwedge \\biguplus \\bigsqcup $"
        }
        this.cm.replaceSelection(content);
    }
    cmdBasic(t) {
        let str = this.cm.getSelection();
        var cur = this.cm.getCursor();
        var content = "";
        if (t == "img") {
            content = "\n\n![图片描述](连接地址或本地路径)\n\n"
        } else if (t == "bold") {
            content = "**" + str + "**"
        } else if (t == "italic") {
            content = "*" + str + "*"
        } else if (t == "del") {
            content = "~~" + str + "~~"
        } else if (t == "blockquote") {
            content = "> " + str + "\n\n";
            if (cur.ch != 0) content = "\n" + content
        } else if (t == "table") {
            content = tableDemo
        } else if (t == "ul") {
            let arr = str.split("\n");
            content = '- ' + arr.join("\n- ");
            if (cur.ch != 0) content = "\n" + content
        } else if (t == "li") {
            let arr = str.split("\n");
            for (var i = 0; i < arr.length; ++i)
                content += i + ". " + arr[i] + "\n"
            if (cur.ch != 0) content = "\n" + content
        } else if (t == "task") {
            let arr = str.split("\n");
            for (var i = 0; i < arr.length; ++i)
                content += "- [ ] " + arr[i] + "\n"
            if (cur.ch != 0) content = "\n" + content
        }
        this.cm.replaceSelection(content);

    }
    cmdChart(t) {
        let str = this.cm.getSelection();
        var cur = this.cm.getCursor();
        let pre = cur.ch == 0 ? '' : '\n';
        var content = "", lang = t;
        if (t == "seq") {
            content = str.length <= 0 ? seqDemo : str;
        } else if (t == "flow") {
            content = str.length <= 0 ? flowDemo : str;
        }
        this.cm.replaceSelection(pre + '```' + lang + "\n" + content + "\n```\n");
        let pos = new Pos(cur.ch == 0 ? cur.line + 1 : cur.line + 2, 0, "after")
        this.cm.setCursor(pos)
    }
    cmdCode(t) {
        let str = this.cm.getSelection();
        var cur = this.cm.getCursor();
        if (t == "inline-code") {
            this.cm.replaceSelection('`' + str + "`");
            let pos = new Pos(cur.line, cur.ch + 1, "after")
            this.cm.setCursor(pos)
        } else {
            var lang = t == "block-code" ? "" : t
            let pre = cur.ch == 0 ? '' : '\n';
            this.cm.replaceSelection(pre + '```' + lang + '\n' + str + "\n```\n");
            let pos = new Pos(cur.ch == 0 ? cur.line + 1 : cur.line + 2, 0, "after")
            this.cm.setCursor(pos)
        }
    }
    cmdH(h: string) {
        var num = parseInt(h.substring(1, 2));
        var pre = "";
        for (var i = 0; i < num; ++i) pre += "#"
        var lnum = this.cm.getCursor().line;
        this.cm.setCursor(lineStart(this.cm, lnum))
        this.cm.replaceSelection(pre + ' ');
    }

    isSelected() {
        return this.isFocus;
    }
    onSwitchChange(isFocus): void {
        this.isFocus = isFocus;
    }
    getTar(): HTMLElement {
        return this.o;
    }
    initEditor() {
        initMDMode();
        this.cm = CodeMirror(this.o, {
            // lineNumbers: true,
            tabSize: 4,
            lineWrapping: true
        });
        let self = this;
        this.cm.on("change", function (cm, obj) { self.onMDChange(cm, obj) })

    }
    setEditContent(path, text) {
        this.path = path;
        this.cm.setValue(text)//设置文件内容
    }
    rerender() {
        this.cm.refresh();
    }
    onMDChange(cm, obj) {
        let text = cm.getValue()
        let html = marked(text, { renderer: renderer })
        if (obj.origin == 'setValue') {
            //刚加载文件内容
            sendEvt(Const.OnResetContent, { "path": this.path, "html": html })
        } else {
            sendEvt(Const.OnEditing, { "path": this.path, "html": html })
        }
        // console.log("md change", obj)
        // if (!this.changeListener)
        //     return;
        // let text = cm.getValue()
        // let html = marked(text, { renderer: renderer })
        // this.changeListener(text, html)
    }

    getContent() {
        return this.cm.getValue();
    }
}