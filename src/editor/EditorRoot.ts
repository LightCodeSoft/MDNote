
import { HBox, VBox } from "../layout/HVBox"
import { BoxCfg } from "../layout/Box"
import EditorTopbar from "./EditorTopbar"
import EditorPreview, { EditorMode } from "./EditorPreview"

import Key, { OnKeyDownListener } from "../tools/Key"
import Path from "../tools/Path"
import { registerEvt, EvtListener } from "../tools/EvtMngr"
import * as Const from "../tools/Const"


export default class EditorRoot extends VBox implements EvtListener {
    topBar: EditorTopbar;
    editorPreview: EditorPreview;
    curFilePath: string | null = null;

    constructor(cfg: BoxCfg | null = null, className: null | string = null, libRoot = "./") {
        super(cfg, className, 2)

        let topBarCfg = BoxCfg.newWithHeight(30)
        this.topBar = new EditorTopbar(topBarCfg);

        this.editorPreview = new EditorPreview(null, null, libRoot);
        this.addChild(this.topBar)
        this.addChild(this.editorPreview)
        registerEvt([Const.SetEditorEmpty, Const.OnOpenFile], this);
        this.setEmpty()
    }
    onEvt(name: any, data: any) {
        if (name == Const.OnOpenFile) {
            this.showContent(data.path, data.content)
        } else if (name == Const.SetEditorEmpty) {
            this.setEmpty();
        }
    }
    setMode(mode: EditorMode) {
        this.editorPreview.setMode(mode)
    }
    getContent() {
        return this.editorPreview.getContent()
    }
    setEmpty() {
        this.topBar.setTitle("", "");
        this.topBar.hide();
        this.editorPreview.hide();
    }
    showContent(path, mdContent, mode: EditorMode = EditorMode.Preview) {
        this.topBar.show();
        this.editorPreview.show();
        this.curFilePath = path;
        let name = Path.getName(path)
        this.topBar.setTitle(name, path);
        this.editorPreview.showContent(path, mdContent, mode);
    }
}