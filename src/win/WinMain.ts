import { default as Elem } from "../layout/Elem";
import Box, { BoxCfg } from "../layout/Box"
import { HBox, VBox } from "../layout/HVBox"
import EditorRoot from "../editor/EditorRoot"
import TopBar from "./TopBar"
import BottomBar from "./BottomBar"
import * as Const from "../tools/Const"
// import Native from "./native/Native"
// import BaseNative from "./native/BaseNative"
import FolderList from "./FolderList"
import FileList from "./FileList"
// import FakeNative from "./native/FakeNative"
import Key from "../tools/Key";
import { EvtListener, registerEvt, sendEvt } from "../tools/EvtMngr";

let _libRoot = "./"

const Native = window.Native

export default class WinMain extends Elem implements EvtListener {
    folderList: FolderList;
    editRoot: EditorRoot;
    rootDir: string = null;

    panelRoot: Box;
    notePanel: HBox;
    calendarPanel: Box;

    constructor() {
        super(document.body)
        this.initViews();
        Key.initKeyListener();
        registerEvt([Const.ReqReloadRootDir, Const.SwithLeftBar, Const.ReqOpenDir //, Const.OnLoadRootDir, Const.OnWebLoad
        ], this);

    }
    onEvt(name: any, data: any) {
        if (name == Const.ReqReloadRootDir) {
            if (this.rootDir)
                this.openDir(this.rootDir)
        } else if (name == Const.ReqOpenDir) {//打开指定目录
            let root = data.root;
            let saveToCfg = data.saveToCfg
            this.openDir(root)

        }
        // else if (name == Const.OnLoadRootDir) {
        //     this.rootDir = data.path;
        //     this.folderList.loadRootDir(this.rootDir)
        // }
        // else if (name == Const.SwithLeftBar) {
        //     let idx = data.idx;

        //     if (idx == 1) {//截屏
        //         sendEvt(Const.ReqCapture)
        //         return;
        //     }
        //     for (var i = 0; i < this.panelRoot.c.length; ++i) {

        //         if (i != idx) this.panelRoot.c[i].hide();
        //         else this.panelRoot.c[i].show();
        //     }
        //     data.cb && data.cb()
        // }
    }
    openFile(path) {
        let self = this;
        let content = Native.readFile(path);
        self.editRoot.showContent(path, content)
        // Native.readFile(path, function (obj) {
        //     if (obj.rs) {
        //         self.editRoot.showContent(path, obj.content)
        //     }
        // })
    }
    openDir(root) {
        // console.log("open root:", root)
        this.folderList.loadRootDir(root);
        // if (saveToCfg) {
        // let appRoot = Native.getAppRoot();
        // let p = appRoot + "/settings.json";
        // Native.writeFile(p, `{"root_dir": "${root}"}`);
        // console.log("write:", p)
        // sendEvt(Const.ReqSaveFile, { path: p, content: `{"root_dir": "${root}"}` })
        // Native.getCfgRoot({
        //     cb: function (rs) {
        //         if (rs && rs.rs) {
        //             let cfgRoot = rs.root;
        //             let p = cfgRoot + "/settings.json";
        //             sendEvt(Const.ReqSaveFile, { path: p, content: `{"root_dir": "${root}"}` })
        //         }
        //     }
        // }, Native)
        // }
    }
    initViews() {
        let root = new VBox(null, "root", 0);
        let topBar = new TopBar();
        // let bottomBar = new BottomBar();
        // let self = this;
        let mid = new HBox(null, "midRoot", 0);
        // let leftBar = new LeftBar();
        // this.panelRoot = new Box();
        // mid.addChild(leftBar).addChild(this.panelRoot);

        //notePanel
        // this.notePanel = new HBox(null, null, 0);
        this.editRoot = new EditorRoot(new BoxCfg().setWResizable(true), "editRoot", _libRoot);
        let folderListCfg = BoxCfg.newWithWidth(260).setWResizable(true);
        this.folderList = new FolderList(folderListCfg);
        let fileListCfg = BoxCfg.newWithWidth(260).setWResizable(true);
        let fileList = new FileList(fileListCfg);
        // this.titleList = new FileTree(titleListCfg, "titleList", null);
        mid.addChild(this.folderList).addChild(fileList).addChild(this.editRoot)

        //calendarPanel
        // this.calendarPanel = new HBox(null);

        // this.panelRoot.addChild(this.notePanel)
        // this.panelRoot.addChild(this.calendarPanel)

        // mid.addChild(this.titleList);
        // mid.addChild(this.editRoot);

        root.addChild(topBar).addChild(mid)
        // .addChild(bottomBar);
        this.addChild(root);

    }
}