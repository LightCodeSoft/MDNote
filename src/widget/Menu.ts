import Elem from "../layout/Elem"
const Identity = "__pyui_contextmenu";


export enum MenuType {
    NewFile = 1,
    NewFolder,
    Copy,
    CopyPath,
    CopyRelativePath,
    Paste,
    Delete,
    Cut,
    Rename,
    OpenInFileExplorer
}

function type2title(type: MenuType) {
    switch (type) {
        case MenuType.NewFile: return "新建文件";
        case MenuType.NewFolder: return "新建分类";
        case MenuType.Copy: return "复制";
        case MenuType.CopyPath: return "复制绝对路径";
        case MenuType.CopyRelativePath: return "复制相对路径";
        case MenuType.Paste: return "粘贴";
        case MenuType.Delete: return "删除";
        case MenuType.Cut: return "剪切";
        case MenuType.Rename: return "重命名";
        case MenuType.OpenInFileExplorer: return "在资源管理器中打开"
    }
    throw "unknow " + type;
}
export class MenuItem {
    type: MenuType;
    t: string;
    a: boolean;
    o: any;
    constructor(type: MenuType, other: any, active: boolean = true) {
        this.type = type;
        this.a = active;
        this.o = other;
        this.t = type2title(type);
    }
}
export class MenuItemList {
    cb = null;
    items: MenuItem[];
    dom = null;
    constructor(cb) { this.cb = cb, this.items = [] };

    refreshDom() {
        let out = new Elem("ul");
        let self = this;
        this.items.forEach(function (item) {
            let c = new Elem("li");
            c.o.innerText = item.t;
            if (item.a == false) {
                c.attr("disable", "true");
            }
            self.cb && c.setOnClickListener(function () {
                self.cb(item)
            })
            out.addChild(c);
        })
        this.dom = out;
        return out;
    }
    getDom() {
        if (this.dom == null)
            this.refreshDom()
        return this.dom;
    }
    add(type, other = null, active = true): MenuItemList {
        let item = new MenuItem(type, other, active)
        this.items.push(item)
        return this;
    }
}
export default class Menu extends Elem {
    constructor() {
        super(null)

        const menuDom = document.getElementById(Identity);
        if (menuDom) this.o = menuDom;
        else {
            this.o = document.createElement("div");
            this.attr("id", Identity);
            this.css("display", "none");
            document.body.appendChild(this.o)
        }
        let self = this;
        document.addEventListener("click", function () { self.hideMenu() });
    }

    addMenu(tar: HTMLElement, onShowMenuFn) {
        tar.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();
            onShowMenuFn(e);
            // let content = items.getDom();
            // self.showMenu(e.pageX, e.pageY, content, e)
        });
    }
    setMenu(items: MenuItemList, tar: HTMLElement) {
        let self = this;
        // tar = tar ? tar : document;
        // let content = this.createMenuContent(items, cb)
        tar.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();
            let content = items.getDom();
            self.showMenu(e.pageX, e.pageY, content)
        });
    }

    // 显示菜单
    showMenu(x, y, obj: Elem) {
        if (!this.o) return;
        this.o.innerHTML = "";
        this.addChild(obj)
        this.o.style.display = "block";
        this.o.style.left = `${x}px`;
        this.o.style.top = `${y}px`;
    }
    // 隐藏菜单
    hideMenu() {
        if (!this.o) return;
        this.o.style.display = "none";
    }
}