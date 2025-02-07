import Elem from "../layout/Elem"
import { dropIcon } from "../tools/Icons"

import addRippleEffect from "../tools/RippleEffect"

export default class Select extends Elem {
    curIdx: number = null;
    private val: any = null;
    private _names: string[] = [];
    private _vals: any[] = [];
    onChangeListener: any = null;
    dropcontent: Elem;
    constructor(names: string[], vals: any[], onChangeListener: any = null) {
        super("dropdown");
        this._names = names;
        this._vals = vals;
        this.onChangeListener = onChangeListener;
        this.initChild()
        let self = this;
        this.hover(function () {
            self.dropcontent.show();
        }, function () {
            self.dropcontent.hide();
        })
    }
    initChild() {
        let firstName = ""
        if (this._names.length > 0) {
            firstName = this._names[0];
            this.val = this._vals[0];
        }
        let dropcontent = new Elem("dropcontent") 
        this.addChild(`<dropbtn><span>${firstName} </span> ${dropIcon} </dropbtn>`)
        this.addChild(dropcontent);
        let self = this;
        for (var i = 0; i < this._names.length; ++i) {
            let name = this._names[i];
            let val = this._vals[i];
            let div = document.createElement("div");
            div.innerText = name;
            div.setAttribute("select_idx", "" + i);

            dropcontent.addChild(div);
            div.onclick = function () {
                let thiz = this as HTMLDivElement;
                let idx = parseInt(thiz.getAttribute("select_idx"))
                self.onclickOption(idx);
            }
        }
        this.dropcontent = dropcontent;
    }
    getVal() {
        return this.val;
    }
    onclickOption(idx: number) {
        let val = this._vals[idx];
        let old = this.val;
        if (old != val) {
            this.val = val;
            (this.o.children[0].children[0] as HTMLElement).innerText = this._names[idx];
            if (this.onChangeListener) {
                this.onChangeListener(val, old);
            }
        }
        this.dropcontent.hide()
    }
}