
import Box, { BoxCfg } from "../layout/Box"
import Iframe from "../widget/Iframe";
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { EvtListener, registerEvt, sendEvt } from "../tools/EvtMngr";
import * as Const from "../tools/Const"

import { initScrollListener, onEditingScroll } from "./utils/scroll_syn.js"

const libs = [
    ["highlight", false],
    ["preview", false],
    // ["jquery.min", true],
    ["raphael.min", true],
    ["highlight.min", true],
    ["flowchart.min", true],
    ["underscore-min", true],
    ["sequence-diagram-min", true],
    // ["tex-svg", true, { id: "MathJax-script", async: "" }]
    ["katex.min", false]

]
let fcCfg = {
    // 'x': 30,
    // 'y': 50,
    'line-width': 3,
    // 'maxWidth': 3,//ensures the flowcharts fits within a certian width
    'line-length': 50,
    'text-margin': 10,
    'font-size': 14,
    'font': 'normal',
    'font-family': 'Helvetica',
    'font-weight': 'normal',
    'font-color': 'black',
    'line-color': 'black',
    'element-color': 'black',
    'fill': 'white',
    'yes-text': 'yes',
    'no-text': 'no',
    'arrow-end': 'block',
    'scale': 1,
    // 'symbols': {
    //     'start': {
    //         'font-color': 'red',
    //         'element-color': 'green',
    //         'fill': '#58c4a3'
    //     },
    //     'end': {
    //         'class': 'end-element'
    //     }
    // },
    // 'flowstate': {
    //     'past': { 'fill': '#CCCCCC', 'font-size': 12 },
    //     'current': { 'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold' },
    //     'future': { 'fill': '#FFFF99' },
    //     'request': { 'fill': 'blue' },
    //     'invalid': { 'fill': '#444444' },
    //     'approved': { 'fill': '#58C4A3', 'font-size': 12, 'yes-text': 'APPROVED', 'no-text': 'n/a' },
    //     'rejected': { 'fill': '#C45879', 'font-size': 12, 'yes-text': 'n/a', 'no-text': 'REJECTED' }
    // }
}
export default class MDPreview extends Box implements OnSwitchModuleListener, EvtListener {
    iframe: Iframe;
    previewDom: HTMLElement | null = null;
    libRoot: string;
    constructor(cfg: BoxCfg | null, libRoot = "./") {
        super(cfg);
        if (libRoot.endsWith("/") || libRoot.endsWith("\\"))
            libRoot = libRoot.substring(0, libRoot.length - 1);
        this.libRoot = libRoot;
        let html = this.createHTML()
        let self = this;
        this.iframe = new Iframe(html, "previewPage", function (iframe) { self.onPreviewReady(iframe); });
        this.addChild(this.iframe)
        registerEvt([Const.OnEditing, Const.OnResetContent], this)
    }
    onPreviewReady(iframe) {
        this.iframe = iframe;
        // self.initScript();
        // onReadyCB && onReadyCB(iframe);
        sendEvt(Const.OnPreviewReady, iframe)
        registerClickSwitch(this)
    }
    onEvt(name: any, data: any) {
        if (name == Const.OnEditing) {
            this.render(data.html)
        } else if (name == Const.OnResetContent) {
            this.render(data.html)
        }
    }
    isSelected() {
        throw new Error("Method not implemented.");
    }
    onSwitchChange(isFocus): void {
    }
    getTar(): HTMLElement {
        return this.iframe.idoc.body;
    }
    private createHTML() {
        let heads = []
        for (const lib of libs) {
            let name = lib[0], isjs = lib[1];
            if (isjs) {
                let attr = {}, attrs = "";
                if (lib.length == 3) attr = lib[2];
                for (let k in attr) {
                    // console.log(k)
                    attrs += k + "=\"" + attr[k] + "\" ";
                }
                // console.log(name, lib.length, attrs, attr)
                heads.push(`<script src="${this.libRoot}/${name}.js" ${attrs}></script>`)
            } else {
                heads.push(`<link rel="stylesheet" href="${this.libRoot}/${name}.css">`)
            }
        }
        let str = heads.join("")
        return `<!DOCTYPE html><html><head>${str}<script>
        // function addContainer(mjx, doc) {
        //     const formulaType = mjx.display ? "block-equation" : "inline-equation";
        //     mjx.typesetRoot.className = formulaType;
        //     mjx.typesetRoot.setAttribute("data-formula", mjx.math);
        //     mjx.typesetRoot.setAttribute("data-formula-type", formulaType);
        // }
        // MathJax = {
        //     tex: {
        //         inlineMath: [["$", "$"]],
        //         displayMath: [["$$", "$$"]],
        //         tags: "ams"
        //     },
        //     svg: { fontCache: "none" },
        //     jax: ["input/TeX", "output/SVG"],
        //     options: {
        //         enableMenu: false,
        //         renderActions: {
        //             addContainer: [190, (doc) => { for (const math of doc.math) { addContainer(math, doc) } }, addContainer]
        //         }
        //     }
        // };
        </script>
        </head><body></body></html>`
    }
    renderPlugins(codetheme = "light") {


        let self = this;
        let $ = this.iframe.iwin.$;
        let Diagram = self.iframe.iwin.Diagram;
        let flowchart = self.iframe.iwin.flowchart;
        let hljs = this.iframe.iwin.hljs;
        let doc = this.iframe.iwin.document;


        hljs.highlightAll();

        doc.querySelectorAll("pre code").forEach(function (e) {
            var p = e.parentElement;
            if (codetheme == "light") {
                p.classList.remove("darkcode");
                p.classList.add("lightcode");
            } else {
                p.classList.remove("lightcode");
                p.classList.add("darkcode");
            }
        })

        doc.querySelectorAll(".flowchart").forEach(function (e) {
            var flowData = e.getAttribute("flow-data");
            var chart = flowchart.parse(flowData);
            chart.drawSVG(e, fcCfg);
        })

        doc.querySelectorAll(".sequence-diagram").forEach(function (e) {
            var seqData = e.getAttribute("seq-data")
            var diagram = Diagram.parse(seqData);
            diagram.drawSVG(e, { theme: 'simple' }); //{ theme: 'hand' }
        })


        doc.querySelectorAll("a").forEach(function (e) {
            e.onclick = function () {
                sendEvt(Const.ReqOpenURL, e.href);
                return false;
            }
        });
    }
    render(html) {
        let dom = this.iframe.idoc.body;
        if (dom) {
            dom.innerHTML = html;
            this.renderPlugins();
        }
    }
}