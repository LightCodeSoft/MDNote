
import Elem from "../layout/Elem";
import Box, { BoxCfg } from "../layout/Box"
import Menu, { MenuType, MenuItemList, MenuItem } from "./Menu"
import Path from "../tools/Path"
import Clip from "../tools/Clip"
import Key, { OnKeyDownListener } from "../tools/Key";
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { sendEvt } from "../tools/EvtMngr"
import * as Const from "../tools/Const"
import Popup from "./Popup";

const FileExtClass = {
    "md": "mdFileIcon"
};

function getIconCls(isDir, isOpen, name) {
    if (isDir) {
        return isOpen ? "dirIconOpen" : "dirIconClose";
    }
    let arr = name.split(".")
    let ext = arr[arr.length - 1].toLowerCase();
    let cls = FileExtClass[ext]
    if (!cls)
        return "fileIcon"
    return cls;
}


class FileItem {
    public childs: FileItem[] | null;//null: file, array: folder
    public name: string;
    public path: string;
    public parent: FileItem | null;
    public level: number;
    public elem: Elem;
    public isDirOpen: boolean = true;
    private onClickListener;
    private icon: Elem;
    private label: Elem;
    public childRoot: Elem;
    private input = null;
    private onInputFinished = null;
    private menu = null;
    constructor(menu: Menu, item, parent: FileItem | null = null, level: number = 0, onClickListener = null) {

        this.menu = menu;
        this.name = item.n;
        this.childs = item.isdir ? [] : null;
        this.path = item.path;
        this.parent = parent;
        this.level = level;
        this.onClickListener = onClickListener;
        this.isDirOpen = item.isDirOpen != false ? true : false;

        this.elem = new Elem(item.isdir ? "ul" : "li");
        this.icon = new Elem("span", getIconCls(item.isdir, true, this.name));
        let label = new Elem("label")
        let self = this;
        label.setOnClickListener(function (e) { self.onClick(e); })
        label.css("padding-left", level * 10 + 5 + "px");
        label.addChild(this.icon);
        label.addChild("<span>" + Path.getName(this.name, false) + "</span>")
        this.elem.addChild(label)
        this.label = label;
        this.childRoot = null;
        if (item.isdir) {
            this.childRoot = new Elem("div");
            this.elem.addChild(this.childRoot)
        }

        //menu
        let other = { p: this.path };
        let menuItemList = new MenuItemList(function (item) {
            menu.hideMenu()//先关闭
            self.onClickMenu(item);
        });
        if (item.isdir) {
            menuItemList.add(MenuType.NewFile, other).add(MenuType.NewFolder).add(MenuType.Paste)
        }
        menuItemList.add(MenuType.Rename, other).add(MenuType.Copy, other)
            .add(MenuType.CopyRelativePath, other).add(MenuType.OpenInFileExplorer).add(MenuType.Delete)

        menu.setMenu(menuItemList, label.o);
        if (item.isdir) {
            for (var i = 0; i < item.childs.length; ++i) {
                let ii = new FileItem(this.menu, item.childs[i], this, this.level + 1, this.onClickListener);
                this.childs.push(ii);
            }
            this.renderChilds()
        }
    }
    private renderChilds() {//排序
        if (!this.childRoot) return;
        this.childs = this.childs.sort(function (a: FileItem, b: FileItem) {
            let aisdir = a.childRoot != null, bisdir = b.childRoot != null;
            if ((aisdir && bisdir) || (!aisdir && !bisdir)) {
                return a.name.localeCompare(b.name)
            } else if (aisdir) return -1
            else return 1;
        })
        this.childRoot.o.innerHTML = "";
        let self = this;
        this.childs.forEach(function (item: FileItem) {
            self.childRoot.addChild(item.elem)
        })
    }

    private initInput() {
        if (this.input == null) {
            this.input = new Elem("input");
            this.input.attr("type", "text");
            this.input.o.onclick = function (e) {
                e && e.stopPropagation();
                this.select();
            }
            let self = this;
            let input = this.input;
            function onfocusout() {
                let val = input.o.value.trim();
                if (val.length > 0) {
                    self.onInputFinished && self.onInputFinished(val)
                }
            }
            this.input.o.addEventListener("focusout", onfocusout)
            this.input.o.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    input.o.blur();
                }
            });
        }
    }
    copy(type) {
        if (type == MenuType.Copy || type == MenuType.CopyPath) {
            // Clip.copy(this.path)
            sendEvt(Const.CopyText, this.path);
        } else if (type == MenuType.CopyRelativePath) {
            let root: FileItem = this;
            while (root.parent != null) root = root.parent;
            let rootPath = Path.standarPath(root.path);
            this.path = Path.standarPath(this.path)
            let p = this.path.substring(rootPath.length)
            if (p.startsWith("\\")) p = p.substring(1)
            // Clip.copy(p)
            sendEvt(Const.CopyText, p);
        }
    }
    paste() {//粘贴

        let self = this
        function cb(rs) {
            if (rs.rs) {
                let isFolder = rs.isFolder;
                if (isFolder || !self.childRoot) {
                    sendEvt(Const.ReqReloadRootDir)
                    return;
                }
                let item = { n: rs.fn, path: Path.join(self.path, rs.fn), isdir: isFolder, childs: isFolder ? [] : null }
                let c = new FileItem(self.menu, item, self, self.level + 1, self.onClickListener);
                self.childs.push(c);
                self.renderChilds()
            } else {
                rs.msg && alert(rs.msg)
            }
        }
        sendEvt(Const.ReadClipboardText, {
            cb: function (text) {
                if (!Path.isValidPath(text))
                    return;
                sendEvt(Const.PasteFile, {
                    "src": text,
                    "dst": self.childRoot ? self.path : Path.getParent(self.path),
                    "cb": cb
                })
            }
        })

    }
    rename() {
        let nameDom = this.label.o.children[1];
        let self = this;
        this.onInputFinished = function (val) {
            sendEvt(Const.ReqRename, {
                "path": self.path, "name": val + ".md", "cb": function (rs) {

                    if (rs &&rs.np&& rs.np.length > 0) {
                        self.name = val;
                        nameDom.innerHTML = val;
                        self.path = rs.np;
                    } else {
                        nameDom.innerHTML = self.name;
                    }
                }
            })
        }
        this.initInput()
        this.input.css("margin-left", 0)
        this.input.o.value = Path.getName(this.name, false);
        nameDom.innerHTML = ""
        nameDom.appendChild(this.input.o);
        this.input.o.focus();
        this.input.o.onclick();

    }
    newFileFolder(isFolder) {
        if (!this.isDirOpen) {
            this.toggleDir();
        }
        function newCb(rs, val) {
            self.childRoot.o.removeChild(self.input.o)
            if (rs) {
                //参考这里，定义目录树
                let item = { n: val, path: Path.join(self.path, val), isdir: isFolder, childs: isFolder ? [] : null }
                let c = new FileItem(self.menu, item, self, self.level + 1, self.onClickListener);
                self.childs.push(c);
                self.renderChilds()
            }
        }
        let self = this;
        this.onInputFinished = function (val) {
            if (!isFolder) val = val + ".md"
            sendEvt(Const.ReqNewFileFolder, {
                "dir": self.path, "name": val, "isFolder": isFolder, "cb": function (rs) {
                    newCb(rs.rs, val)
                }
            })
        }
        this.initInput();
        this.input.css("margin-left", (this.level + 1) * 10 + 5 + "px")
        this.input.o.value = isFolder ? "新建目录" : "新建文件";
        this.childRoot.o.insertBefore(this.input.o, this.childRoot.o.firstChild);
        this.input.o.focus();
        this.input.o.onclick();
    }
    onClickMenu(item: MenuItem) {
        switch (item.type) {
            case MenuType.Rename: {
                this.rename();
                break
            }
            case MenuType.NewFile: {
                this.newFileFolder(false);
                break;
            }
            case MenuType.NewFolder: {
                this.newFileFolder(true);
                break;
            }
            case MenuType.Paste: {
                this.paste();
                break;
            }
            case MenuType.OpenInFileExplorer: {
                sendEvt(Const.OpenInExplorer, this.path)
                break;
            }
            case MenuType.CopyPath:
            case MenuType.CopyRelativePath:
            case MenuType.Copy: {
                this.copy(item.type)
                break;
            }
            case MenuType.Delete: {
                this.remove();
                break;
            }
        }
    }
    reqSwitchFile() {//切换文件
        let self = this;
        function loadFile() {
            sendEvt(Const.ReqOpenFile, self.path)
            self.setSelected();
            if (self.onClickListener != null) {//要让FileTree知道当前选中了自己
                self.onClickListener(self)
            }
        }
        function cb(isSaved) {
            if (isSaved) {
                loadFile();
            } else {
                Popup.confirm("当前文件未保存，是否保存？", function () {//保存
                    sendEvt(Const.OnKeydownSave, {
                        "cb": function (rs) {
                            if (rs) loadFile()
                            else Popup.alert("文件保持失败！")
                        }
                    })
                }, function () {//不保存
                    loadFile();
                })
            }
        }
        if (!this.childRoot) {
            sendEvt(Const.CheckFileSaved, {
                "path": this.path, "cb": cb
            })
        }

    }
    remove() {
        if (this.parent == null) return;//根目录，不允许删除
        let self = this;
        function rm() {
            let parent = self.parent;
            let idx = -1;
            for (var i = 0; i < parent.childs.length; ++i) {
                if (parent.childs[i] == self) {
                    idx = i;
                    break;
                }
            }
            if (idx < 0) return;
            parent.childs.splice(idx, 1);
            parent.renderChilds();
            sendEvt(Const.SetEditorEmpty)
        }
        sendEvt(Const.ReqDelPath, {
            "path": self.path, "cb": function (rs) {
                if (rs.rs) {
                    rm()
                }
            }
        });
        // Popup.confirm("是否确定删除文件" + this.path, function () {//删除


        // })
    }
    setSelected() {
        let lastSelected = document.querySelectorAll(".fileTree .selectedTitle");
        lastSelected.forEach(function (val) {
            val.classList.remove("selectedTitle");
        })

        this.label.addClass("selectedTitle")
    }
    toggleDir() {
        this.isDirOpen = !this.isDirOpen;
        if (this.isDirOpen) {
            this.childRoot.show();
            this.icon.removeClass("dirIconClose")
            this.icon.addClass("dirIconOpen")
        } else {
            this.childRoot.hide();
            this.icon.removeClass("dirIconOpen")
            this.icon.addClass("dirIconClose")
        }
    }
    onClick(e) {//点击到自己这一项
        if (this.childRoot != null) {//dir
            this.toggleDir();
            this.setSelected();
        } else {
            this.reqSwitchFile()
        }
        // sendEvt(Const.ReqOpenFile, this.path)

        // e && e.stopPropagation();
    }
}


export default class FileTree extends Box implements OnSwitchModuleListener, OnKeyDownListener {
    fileItem: FileItem = null;
    menu: Menu = null;
    curFilePath: string | null = null;
    selectedItem: FileItem = null;
    isFocusFileTree: boolean = false;
    /**
     *
     * fileTree:{
     *  name: "xxx",
     *  isdir:true,
     *  path:string,
     *  childs:[
     *      {name:"yyy", isdir:false,childs:[]},
     *      {...}
     *  ]
     *
     * }
    */
    constructor(cfg: BoxCfg | null = null, className: null | string = null, fileTree: Record<string, any> = {}) {
        super(cfg, "fileTree")

        this.menu = new Menu();
        let self = this;

        let menuList = new MenuItemList(function (item) { self.onMenuClick(item) })
        menuList.add(MenuType.NewFile).add(MenuType.NewFolder).add(MenuType.Paste)
        this.menu.setMenu(menuList, this.o);

        if (className != null) {
            this.addClass(className)
        }
        this.setFileTree(fileTree);
        registerClickSwitch(this);
        this.setOnClickListener(function (e) { if (e.target == self.o) { self.selectedItem = self.fileItem; } })
        Key.registerKeydown(this)
        // Key.registerCtrlC(function () { if (self.selectedItem != null) self.selectedItem.copy(MenuType.Copy); return true; })
        // Key.registerCtrlV(function () { if (self.selectedItem != null) self.selectedItem.paste(); return true; })

    }
    onKeyDown(e: any) {
        if (e.ctrlKey && e.key === 'c') {
            if (this.selectedItem != null) {
                this.selectedItem.copy(MenuType.Copy);
                return false;
            }
        } else if (e.ctrlKey && e.key === 'v') {
            if (this.selectedItem != null)
                this.selectedItem.paste();
            return false
        } else if (e.key === 'Delete') {
            if (this.selectedItem != null)
                this.selectedItem.remove();
            return false
        }
        return true;
    }

    isSelected(): boolean {
        return this.isFocusFileTree;
    }

    onSwitchChange(isFocus): void {
        this.isFocusFileTree = isFocus;
    }
    getTar(): HTMLElement {
        return this.o;
    }
    getCurFilePath() {
        return this.curFilePath;
    }
    onMenuClick(item) {
        switch (item.type) {
            case MenuType.NewFile: {
                this.fileItem.newFileFolder(false);
                break;
            }
            case MenuType.NewFolder: {
                this.fileItem.newFileFolder(true);
                break;
            }
            case MenuType.Paste: {
                this.fileItem.paste();
            }
        }
    }
    onClickItem(item: FileItem) {
        this.selectedItem = item;
        if (item.childRoot != null) return;//folder
        this.curFilePath = item.path
    }
    render() {
        let root = this.fileItem.elem
        this.removeAllChild()
        this.addChild(root)
    }
    setFileTree(fileTree) {
        if (!fileTree) return;
        let self = this;
        this.fileItem = new FileItem(this.menu, fileTree, null, 0, function (item) {
            self.onClickItem(item);
        });
        this.render();
        this.fileItem.setSelected();
        this.selectedItem = this.fileItem;
    }
}