
import Box, { BoxCfg } from "../layout/Box"
import Elem from "../layout/Elem";
import { VBox } from "../layout/HVBox";
import * as Const from "../tools/Const"
import { sendEvt } from "../tools/EvtMngr";
import Path from "../tools/Path";
import ListView from "../widget/ListView"
import { MenuItemList, MenuType } from "../widget/Menu";
import Popup from "../widget/Popup";
let Native = window.Native;
const Colors = ["#E41323", "#3786BD", "#0166AC", "#592C8E", "#C39F74", "#7CC102", "#00B24A",
    "#1CC2B2", "#C73775", "#96A2A7", "#014E89", "#FABE14", "#5DB081", "#E44451", "#A80088",
    "#029DD4", "#F2610C"];
export default class FolderList extends VBox {
    folderListView: ListView;
    createFolderBtn: Elem;
    nameList: any[] = [];
    rootDir: string = null;


    constructor(cfg) {
        super(cfg, ["filefolderList", "folderList"])

        let self = this;
        let btnCfg = BoxCfg.newWithHeight(30).setWResizable(true);
        this.createFolderBtn = new Box(btnCfg, "createFolderBtn");
        this.createFolderBtn.o.innerHTML = "+ 添加分类";
        this.createFolderBtn.setOnClickListener(function () { self.onClkNewFolder() })
        this.folderListView = new ListView(null, null, function (idx) { self.onClickItem(idx); }, function (idx, text, elem) { return self.onRenderItem(idx, text, elem) });
        this.addChild(this.createFolderBtn)
        this.addChild(this.folderListView)

        this.folderListView.setOnBgMenuListener(function (e: MouseEvent) { return self.onBgMenu(e) })
        this.folderListView.setOnItemMenuListener(function (idx: number, e: MouseEvent) { return self.onItemMenu(idx, e) })
    }
    //点击背景时的弹出菜单
    onBgMenu(e: MouseEvent) {
        let self = this;
        function onClkItem(item) {
            if (item.type == MenuType.NewFolder) {
                self.onClkNewFolder()
            }
            else if (item.type == MenuType.OpenInFileExplorer) {
                self.performOpenInFileExplorer(self.rootDir);
            }
        }
        let menuList = new MenuItemList(function (item) { onClkItem(item) })
        menuList.add(MenuType.NewFolder);

        if (self.rootDir != null)
            menuList.add(MenuType.OpenInFileExplorer)
        console.log(e.x, e.y)
        return menuList;
    }
    performRename(idx) {
        let oldName = this.nameList[idx];
        let self = this;
        function onNewName(name) {
            let rs = Native.rename(self.rootDir + "/" + oldName, name);
            if (rs) {
                self.nameList[idx] = name;
                self.folderListView.setName(idx, name)
            } else {
                Popup.alert("重命名失败，请检查名称是否已存在！");
            }
        }
        this.folderListView.showRenameInp(idx, onNewName)
    }
    performDelete(idx) {
        let item = this.nameList[idx];
        let self = this;
        let path = this.rootDir + "/" + item

        Popup.confirm("是否确认删除" + path, function () {
            let rs = Native.delPath(path);
            if (rs) {
                self.folderListView.removeChild(idx);
                self.nameList.splice(idx, 1);
            }
        })
        // sendEvt(Const.ReqDelPath, {
        //     "path": item.p, "cb": function (rs) {
        //         if (rs.rs) {
        //             self.folderListView.removeChild(idx);
        //             self.nameList.splice(idx, 1);
        //         }
        //     }
        // });
    }

    performOpenInFileExplorer(idx) {
        let p = this.rootDir;
        if (idx != null && idx != undefined) {
            let item = this.nameList[idx];
            p = p + "\\" + item;
        }

        // sendEvt(Const.OpenInExplorer, p);
        // console.log("open explorer:",p)
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
        var name = "新建分类";
        var idx = 0;
        while (true) {
            var n = name;
            if (idx != 0) n = name + "_" + idx
            var included = false;
            for (var i = 0; i < this.nameList.length; ++i) {
                if (n == this.nameList[i]) {
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
    onClkNewFolder() {
        if (this.rootDir == null) return;
        let self = this;
        let defaultName = this.getNewName();
        this.folderListView.newItem(defaultName, function (name) {
            let dirpath = self.rootDir + "\\" + name;
            if (Native.exists(dirpath)) {
                Popup.alert(`<${name}>已存在,请更换名称！`);
                return;
            }
            Native.mkdirs(dirpath);
            if (Native.exists(dirpath)) {
                self.nameList.unshift(name)
                self.folderListView.addItem(name);
            } else {
                Popup.alert(`创建失败，请检查${name}是否已存在，或名称是否有效`);

            }

            // sendEvt(Const.ReqNewFileFolder, {
            //     "dir": self.rootDir, "name": name, "isFolder": true, "cb": function (rs) {
            //         if (rs.rs) {
            //             self.folderList.unshift({ n: name, p: Path.join(self.rootDir, name) })
            //             // console.log("after add:", self.folderList)
            //             self.folderListView.addItem(name);
            //         }
            //     }
            // })
        })
    }
    onRenderItem(idx, text, elem) {
        idx = idx % Colors.length;
        let color = Colors[idx];
        elem.o.innerHTML = `<span style="background:${color};"></span><span>${text}</span>`;
        elem.idxOfInpChild = 1;
        return elem;
    }
    onClickItem(idx) {
        let path = this.rootDir + "/" + this.nameList[idx];
        sendEvt(Const.OnSwitchFolder, { root: path })
    }
    loadRootDir(root) {
        this.rootDir = root;
        let names = Native.listdir(root, 2 /*only dir*/);
        if (!names) return;
        this.nameList = names;
        this.folderListView.setListData(names);
        if (names.length > 0) {
            this.folderListView.onClickItem(0)
        }
        // this._setFolderList(dirs)
        // console.log("dirs:==>", dirs)
        // sendEvt(Const.GetFolderList, { "root": root, cb: function (folderList) { self._setFolderList(folderList) } })
    }
    // private _setFolderList(folderList) {
    //     console.log("set folder list", folderList)
    //     if (!folderList) return;
    //     this.folderList = folderList;
    //     var names = [];

    //     this.folderListView.setListData(names);
    //     if (names.length > 0) {
    //         this.folderListView.onClickItem(0)
    //     }
    // }

}