
import Box, { BoxCfg } from "../layout/Box"
import Elem from "../layout/Elem";
import { VBox } from "../layout/HVBox";
import * as Const from "../tools/Const"
import { EvtListener, registerEvt, sendEvt } from "../tools/EvtMngr";
import Button from "../widget/Button";
import ListView from "../widget/ListView"
import { EditIcon } from "../tools/Icons"
import Path from "../tools/Path";
import Popup from "../widget/Popup";
import { MenuItemList, MenuType } from "../widget/Menu";
let Native = window.Native;
export default class FileList extends VBox implements EvtListener {

    curRoot: string = null;
    fileListView: ListView;
    nameList: any[] = []
    constructor(cfg) {
        super(cfg, ["filefolderList", "fileList"])

        let boxCfg = BoxCfg.newWithHeight(50).setWResizable(true);
        let topBox = new Box(boxCfg, "fileListTop");
        let addFileBtn = new Button("<span>" + EditIcon + "新建笔记</span>");
        let self = this;
        addFileBtn.setOnClickListener(function () { self.onClkNewFile() })
        this.fileListView = new ListView(null, null, function (idx) { self.onClickItem(idx); });

        topBox.addChild(addFileBtn)
        this.addChild(topBox)
        this.addChild(this.fileListView)
        registerEvt(Const.OnSwitchFolder, this);

        // this.fileListView.setOnBgMenuListener(function (e: MouseEvent) { return self.onBgMenu(e) })
        this.fileListView.setOnItemMenuListener(function (idx: number, e: MouseEvent) { return self.onItemMenu(idx, e) })
    }
    // onBgMenu(e: MouseEvent) {
    //     let self = this;
    //     function onClkItem(item) {
    //         if (item.type == MenuType.NewFile) {
    //             self.onClkNewFile()
    //         }
    //     }
    //     let menuList = new MenuItemList(function (item) { onClkItem(item) })
    //     menuList.add(MenuType.NewFile);

    //     return menuList;
    // }
    performRename(idx) {
        let oldName = this.nameList[idx];
        let self = this;
        function onNewName(name) {
            let rs = Native.rename(self.curRoot + "/" + oldName, name+".md");
            if (rs) {
                self.nameList[idx] = name+".md";
                self.fileListView.setName(idx, name)
            } else {
                Popup.alert("重命名失败，请检查名称是否已存在！");
            }
        }
        this.fileListView.showRenameInp(idx, onNewName)
    }
    performDelete(idx) {
        let item = this.nameList[idx];
        let self = this;
        let path = this.curRoot + "/" + item

        Popup.confirm("是否确认删除" + path, function () {
            let rs = Native.delPath(path);
            if (rs) {
                self.fileListView.removeChild(idx);
                self.nameList.splice(idx, 1);
            }
        })
    }

    performOpenInFileExplorer(idx) {
        let p = this.curRoot;
        if (idx != null && idx != undefined) {
            let item = this.nameList[idx];
            p = p + "\\" + item;
        }
        Native.openInExplorer(p);

    }
    //点击选项时的弹出菜单
    onItemMenu(idx: number, e: MouseEvent) {
        let self = this;
        function onClkItem(item) {
            if (item.type == MenuType.Rename) {//rename
                self.performRename(idx);
            } else if (item.type == MenuType.Delete) {//delete
                self.performDelete(idx);
            } else if (item.type == MenuType.OpenInFileExplorer) {
                self.performOpenInFileExplorer(idx);
            }
        }
        let menuList = new MenuItemList(function (item) { onClkItem(item) })
        menuList.add(MenuType.Rename).add(MenuType.Delete).add(MenuType.OpenInFileExplorer)
        return menuList;
    }
    getNewName() {
        var name = "新笔记";
        var idx = 0;
        while (true) {
            var n = name;
            if (idx != 0) n = name + "_" + idx
            var nn = n + '.md'
            var included = false;
            for (var i = 0; i < this.nameList.length; ++i) {
                if (nn == this.nameList[i]) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                name = n
                break;
            }
            idx = idx + 1;
        }
        return name;
    }
    onClkNewFile() {
        if (this.curRoot == null) return;
        let self = this;
        let defaultName = this.getNewName();
        this.fileListView.newItem(defaultName, function (name) {
            let rs = Native.createFile(self.curRoot + "/" + name + ".md");
            if (rs) {
                self.fileListView.addItem(name);
                self.nameList.unshift(name + '.md')
            }
        })
    }

    reqSwitchFile(idx) {//切换文件
        if (idx < 0) return;
        var item = this.nameList[idx];

        let self = this;
        function loadFile() {
            let path = self.curRoot + "/" + item;
            let content = Native.readFile(path);
            sendEvt(Const.OnOpenFile, { "path": path, "content": content })

        }
        function cb(isSaved) {
            if (isSaved) {
                loadFile();
            } else {
                Popup.confirm("当前文件未保存，是否保存？", function () {//保存
                    sendEvt(Const.OnKeydownSave, {
                        "cb": function (rs) {
                            if (rs) loadFile()
                            else Popup.alert("文件保存失败！")
                        }
                    })
                }, function () {//不保存
                    loadFile();
                })
            }
        }
        sendEvt(Const.CheckFileSaved, {
            "path": item.p, "cb": cb
        })

    }
    //设置当前文件列表根目录
    setDirPath(dir: string) {
        this.curRoot = dir;
        let names_ = Native.listdir(dir, 1/*Only file*/);
        let names: string[] = [], names_no_ext: string[] = [];
        names_.forEach(function (n: string) {
            if (n.toLowerCase().endsWith(".md")) {
                names.push(n);
                names_no_ext.push(n.substring(0, n.length - 3));
            }
        });
        this.nameList = names;
        this.fileListView.setListData(names_no_ext);
        if (names.length > 0) {
            this.fileListView.onClickItem(0)
        }


    }
    onEvt(name: any, data: any) {
        let self = this;
        if (name == Const.OnSwitchFolder) {
            this.setDirPath(data.root);
        }
    }
    onClickItem(idx) {
        this.reqSwitchFile(idx)
    }
}