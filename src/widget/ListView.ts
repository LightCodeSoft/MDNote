
import Elem from "../layout/Elem";
import Box, { BoxCfg } from "../layout/Box"
import Menu, { MenuType, MenuItemList, MenuItem } from "./Menu"
import Path from "../tools/Path"
import Key, { OnKeyDownListener } from "../tools/Key";
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { sendEvt } from "../tools/EvtMngr"
import * as Const from "../tools/Const"
import Popup from "./Popup";


export default class ListView extends Box implements OnSwitchModuleListener, OnKeyDownListener {
    ul: Elem;
    menu: Menu;
    isFocus: boolean = false;
    onRenderItem: any;
    curIdx: number = -1;

    private input = null;//输入框
    private onInputFinished = null;
    onClickItemCb: ((number) => void) | null = null;//点击列表项目需要发出的事件名称
    onItemMenuListener: ((idx: number, e: MouseEvent) => MenuItemList) | null = null;
    onBgMenuListener: ((e: MouseEvent) => MenuItemList) | null = null;

    constructor(cfg: BoxCfg | null = null, className: null | string = null, onClickItemCb: ((number) => void) | null = null, onRenderItem: any = null) {
        super(cfg, "__pyui_listview", "div")
        this.ul = new Elem("ul");
        // console.log(this.ul)
        this.addChild(this.ul);
        this.onRenderItem = onRenderItem;
        this.onClickItemCb = onClickItemCb;
        // this.initInput();
        registerClickSwitch(this);



        this.menu = new Menu();
        let self = this;

        // this.menu.setMenu(menuList, this.ul.o);
        this.menu.addMenu(this.ul.o, function (e) { self.onShowMenu(e) })

    }
    onKeyDown(e: any) {
        throw new Error("Method not implemented.");
    }

    isSelected(): boolean {
        return this.isFocus;
    }

    onSwitchChange(isFocus): void {
        this.isFocus = isFocus;
    }
    getTar(): HTMLElement {
        return this.o as HTMLElement;
    }
    showRenameInp(idx, cb) {
        let tar = this._getInputRoot(idx);
        if (tar == null) return;
        this.initInput();
        let oldName = tar.innerHTML;
        tar.innerHTML = ""
        tar.appendChild(this.input.o);
        this.input.o.value = oldName;
        let self = this;
        this.onInputFinished = function () {
            let name = self.input.o.value.trim();
            tar.innerHTML = oldName
            if (name.length > 0) {
                cb(name)
            }
        }
        this.input.o.focus();
        this.input.o.onclick();
    }
    //获取input要插入的父标签
    private _getInputRoot(itemIdx) {
        if (itemIdx < 0 || itemIdx > this.ul.c.length) return null;
        let child = this.ul.c[itemIdx];
        let tar = child.o;
        if ((child as any).idxOfInpChild != undefined) {
            tar = child.o.children[(child as any).idxOfInpChild] as HTMLElement;
        }
        return tar;
    }
    setName(idx, newName) {
        let tar = this._getInputRoot(idx);
        if (tar == null) return;
        tar.innerHTML = newName;
    }
    removeChild(idx: number | Elem): number {
        console.log("remove:", idx)
        let total = this.c.length;
        let i = this.ul.removeChild(idx);
        if (i >= 0) {
            this._bindIdxForChild()//顺序变了，需要重新绑定

            if (i == this.curIdx) {//恰好删除到选中的
                this.curIdx = -1;
                if (i == total - 1) {
                    this.onClickItem(i - 1);
                } else {
                    this.onClickItem(i);
                }
            } else {
                if (i < this.curIdx) {
                    this.curIdx -= 1;
                }
            }
        }
        return i;
    }
    setOnItemMenuListener(onItemMenuListener) { this.onItemMenuListener = onItemMenuListener }
    setOnBgMenuListener(onBgMenuListener) { this.onBgMenuListener = onBgMenuListener }



    onShowMenu(e: MouseEvent) {
        let self = this;
        function showMenu(e, items: MenuItemList) {
            let content = items.getDom();
            self.menu.showMenu(e.pageX, e.pageY, content)
        }
        if (e.target == this.ul.o) {
            if (this.onBgMenuListener != null) {
                let items = this.onBgMenuListener(e);
                showMenu(e, items);
            }
        } else {
            if (!this.onItemMenuListener) return;
            var c = (e.target as HTMLElement)
            var p = c.parentElement;
            while (p && p != this.ul.o) {
                c = p;
                p = p.parentElement;
            }
            if (p && p == this.ul.o) {
                let idx = Array.from(this.ul.o.children).indexOf(c)
                let items = this.onItemMenuListener(idx, e);
                showMenu(e, items);

            }
        }
    }
    onMenuClick(item) {
        switch (item.type) {
            // case MenuType.NewFile: {
            //     this.fileItem.newFileFolder(false);
            //     break;
            // }
            // case MenuType.NewFolder: {
            //     this.fileItem.newFileFolder(true);
            //     break;
            // }
            // case MenuType.Paste: {
            //     this.fileItem.paste();
            // }
        }
    }
     setSel(idx) {
        this.ul.c.forEach(function (e) {
            e.removeClass("lsItemSelected")
        })
        this.curIdx = idx;
        this.ul.c[this.curIdx].addClass("lsItemSelected");
    }

    newItem(defaultName, cb) {
        let child = this.newItemElem(this.ul.c.length, defaultName);
        this.initInput()
        this.input.css("margin-left", 0)
        this.input.o.value = defaultName;

        let tar = child.o;
        if ((child as any).idxOfInpChild != undefined) {
            tar = child.o.children[(child as any).idxOfInpChild] as HTMLElement;
        }
        tar.innerHTML = ""
        tar.appendChild(this.input.o);
        this.addItem(child)
        let self = this;
        this.onInputFinished = function () {
            self.ul.removeChild(child)
            self._bindIdxForChild();
            let name = self.input.o.value.trim();
            console.log(name)
            if (name.length > 0) {
                cb(name)
            }
        }
        this.input.o.focus();
        this.input.o.onclick();
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
    onClickItem(idx) {
        if (idx == this.curIdx) return;
        if (this.onClickItemCb != null)
            this.onClickItemCb(idx);
        // if (this.onClickItemCb != null) {
        // let self = this;
        // sendEvt(Const.OnSwitchFolder, data);
        // function cb() {
        //     self.setSel(idx);
        // }
        // data.cb = cb;
        // }
        this.setSel(idx);
    }
    addItem(name: string | Elem, needBindClick = true) {
        let child: Elem;
        if (name instanceof Elem) {
            child = name;
        } else {
            child = this.newItemElem(this.ul.c.length, name);
        }
        // this.addChild(child);
        this.ul.c.unshift(child);
        this.ul.o.insertBefore(child.o, this.ul.o.firstChild);
        child.p = this;
        if (needBindClick)
            this._bindIdxForChild(); //重新绑定点击
        if (this.curIdx >= 0)
            this.curIdx += 1;//把上次选中的选项自动+1
    }
    private newItemElem(idx, name): Elem {
        let sub = new Elem("li");
        // let self = this;
        if (this.onRenderItem) {
            sub = this.onRenderItem(idx, name, sub);
        } else {
            sub.o.innerHTML = name;
        }
        // sub.setOnClickListener(function () {
        //     self.onClickItem(idx)
        // })
        return sub;
    }
    private _bindIdxForChild() {
        let self = this;
        this.ul.c.forEach((c: Elem, i) => {
            c.setOnClickListener(function () { self.onClickItem(i) })
        });

    }
    setListData(names) {
        this.ul.c = [];
        this.ul.o.innerHTML = "";
        let self = this;
        for (var i = names.length - 1; i >= 0; --i) {
            let sub = this.newItemElem(i, names[i]);
            self.addItem(sub, false);
        }
        this._bindIdxForChild();//等所有选项加载后再重新绑定点击

    }
}