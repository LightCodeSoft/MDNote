import CMEditor from "./CMEditor.js"
import { HBox, VBox } from "../layout/HVBox.js"
import { BoxCfg } from "../layout/Box.js"
import MDPreview from "./MDPreview.js"
import { initScrollListener, onEditingScroll } from "./utils/scroll_syn.js"
import Mouse from "../tools/Mouse.js"
import { EvtListener, registerEvt } from "../tools/EvtMngr.js"
import * as Const from "../tools/Const"

export enum EditorMode {
    Edit = 1,
    Preview,
    EditPreview
}

export default class EditorPreview extends HBox implements EvtListener {
    editor: CMEditor;
    preview: MDPreview;
    preMode: EditorMode = EditorMode.EditPreview
    mode: EditorMode;

    constructor(cfg: BoxCfg | null = null, className: null | string = null, libRoot = "./") {
        super(cfg, className, 2)
        this.editor = new CMEditor(null);
        this.preview = new MDPreview(null, libRoot);
        this.addChild(this.editor)
        this.addChild(this.preview)
        this.setMode(EditorMode.Preview)
        registerEvt([Const.OnEditing, Const.OnPreviewReady, Const.ToggleEditPreviewMode], this)

    }
    onEvt(name: any, data: any) {
        if (name == Const.OnPreviewReady) {
            this.onPreviewReady()
        } else if (name == Const.OnEditing) {
            onEditingScroll(this.editor.cm, this.preview.iframe.idoc.body);
        } else if (name == Const.ToggleEditPreviewMode) {
            // this.toggleMode(data)
            this.setMode(data.mode)
        }
    }
    setMode(mode: EditorMode = EditorMode.Preview) {
        if (mode == this.mode) return;
        if (mode == EditorMode.Edit) {
            this.preview.cfg.weight = 0;
            this.editor.cfg.weight = 1;
        } else if (mode == EditorMode.Preview) {
            this.preview.cfg.weight = 1;
            this.editor.cfg.weight = 0
        } else {
            this.preview.cfg.weight = 1;
            this.editor.cfg.weight = 1
        }
        this.rerender()
        this.editor.rerender();
        this.preMode = this.mode;
        this.mode = mode;
    }
    // toggleMode() {
    //     if (this.mode == EditorMode.Edit || this.mode == EditorMode.Preview) {
    //         this.setMode(EditorMode.EditPreview)
    //     } else {
    //         if (this.preMode == EditorMode.Edit)
    //             this.setMode(EditorMode.Preview)
    //         else
    //             this.setMode(EditorMode.Edit)
    //     }

    // }

    getContent() {
        return this.editor.getContent();
    }

    showContent(path, mdContent, mode: EditorMode = EditorMode.Preview) {
        this.setMode(mode)
        this.editor.setEditContent(path, mdContent);
    }

    onPreviewReady() {
        let self = this;
        let cm = this.editor.cm, previewDom = this.preview.iframe.idoc.body;
        initScrollListener(cm, previewDom)
    }
}