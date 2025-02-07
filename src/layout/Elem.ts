import { Rect, Size, Point } from "../tools/Geometry"

const _P = new DOMParser();
const _V_Key = new Set(["width", "height"]);
export default class Elem {
    public o: HTMLElement | null = null;//current
    p: Elem | null = null;//parent
    c: Elem[] = []; //childs

    constructor(obj: string | HTMLElement | Elem | null, className: string | string[] | null = null) {
        if (obj instanceof Elem) {
            this.o = obj.o;
            this.p = obj.p;
            this.c = obj.c;
        } else
            this.o = this.createObj(obj);
        this.addClass(className);
        this.bindEvts();
    }

    bindEvts() {
        if (this.o == null) return;
        let self = this;
        this.o.onclick = function (e) {
            let rs = self.onClick(e);
            if (rs) {
                e.preventDefault();
                e.stopPropagation();
                return true;
            }
        }
    }
    //返回是否阻止冒泡，true阻止
    protected onClick(e): boolean {
        return false;
    }
    private createObj(name: string | HTMLElement | null): HTMLElement | null {
        if (name == null) return null;
        if (name instanceof HTMLElement) return name;
        name = name.trim();
        if (name.length <= 0) return null;

        var out = null;
        if (name.startsWith("<")) {
            const doc = _P.parseFromString(name, 'text/html');
            out = doc.body.firstChild;
        } else {
            out = document.createElement(name)
        }
        return out;
    }

    addClass(name: string | string[] | null) {
        // console.log("addclass--->", name)
        if (name == null || this.o == null) return;
        if (typeof name === 'string') {
            name = name.trim()
            if (name.length > 0)
                this.o.classList.add(name)
        }
        else if (name instanceof Array) {
            let self = this;
            // console.log("class array===>", name)
            name.forEach(function (v) {
                self.o.classList.add(v)
            })
        }

    }

    removeChild(idxOrChild: number | Elem): number {
        let index = idxOrChild as number;
        if (idxOrChild instanceof Elem) {
            index = this.c.indexOf(idxOrChild);
        }
        if (index > -1) { // only splice array when item is found
            this.o.removeChild(this.c[index].o);
            this.c.splice(index, 1); // 2nd parameter means remove one item only
        }
        return index;
    }

    removeClass(name: string | string[] | null) {
        if (name == null || this.o == null) return;
        if (typeof name === 'string')
            this.o.classList.remove(name)
        else if (name instanceof Array) {
            name.forEach(function (v) {
                this.o.classList.remove(v)
            })
        }
    }

    //return child
    addChild(c: Elem | string | HTMLElement): Elem {
        // console.log(this.o, "addChild", c.o)
        var out: Elem;
        if (typeof c === 'string' || c instanceof HTMLElement) {
            out = new Elem(c);
        } else if (c instanceof Elem) {
            out = c;
        }
        if (out.p != null) {
            const index = out.p.c.indexOf(out);
            if (index > -1) { // only splice array when item is found
                out.p.c.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        out.p = this;
        this.c.push(out);
        this.o.appendChild(out.o);
        // return out;
        return this;
    }
    removeAllChild() {
        this.o.innerHTML = "";
    }
    innerChild(c: string | Elem) {
        if (typeof c === 'string') {
            this.o.innerHTML = c;
        } else if (c instanceof Elem) {
            this.o.innerHTML = "";
            this.o.appendChild(c.o);
        }
    }
    private toPX(v: null | number | string): null | string {
        if (v == null) return null;

        if (typeof v === 'string' && (v.indexOf("px") > 0 || v.indexOf("%") > 0)) {
            return v;
        } else {//number or string without px
            return v + "px";
        }

    }
    // getStyle() {
    //     let style = this.o.getAttribute("style");
    //     if (!style) return {};
    //     var regex = /([\w-]*)\s*:\s*([^;]*)/g;
    //     var match, properties = {};
    //     while (match = regex.exec(style)) properties[match[1]] = match[2].trim();
    //     return properties
    // }
    // setStyle(val: string | Record<string, string>) {
    //     if (typeof val === 'string')
    //         this.o.setAttribute("style", val);
    //     else {

    //     }
    // }
    /**
     * 设置css时是部分实现，并非所有
     * **/
    css(name: string | null, val: string | number | null): Elem {
        if (name == null) return this;
        name = name.trim();
        if (name && val) {
            let v = "";
            if (_V_Key.has(name.toLowerCase()))
                v = this.toPX(val);
            else {
                v = val as string;
            }
            this.o.style[name] = v;
            return this;
        } else if (name) {
            return this.o.style[name]
        }
    }
    css_dict(kv_dict: Record<string, string | number>): Elem {
        for (var k in kv_dict) {
            var v = kv_dict[k];
            this.css(k, v);
        }
        return this;
    }
    setOnClickListener(func): Elem {
        this.o.onclick = func;
        return this;
    }
    background(color: null | string = null): string | Elem {
        if (color == null) {
            return getComputedStyle(this.o).backgroundColor;
        } else {
            this.css("background-color", color);
            return this;
        }
    }
    width(w: null | number | string = null): number | Elem {
        if (w != null) {
            this.css("width", w);
            return this;
        }
        return this.o.offsetWidth;
    }
    height(h: null | number | string = null): number | Elem {
        if (h != null) {
            this.css("height", h);
            return this;
        }
        return this.o.offsetHeight;
    }

    size(w: number | null = null, h: number | null = null): Size | Elem {
        if (w == null && h == null)
            return new Size(this.o.offsetWidth, this.o.offsetHeight)
        else if (w != null) {
            this.width(w);
            return this;
        } else {
            this.height(h);
            return this;
        }
    }
    xy(x: number | null = null, y: number | null = null): Point | Elem {
        if (x == null && y == null)
            return new Point(this.o.offsetLeft, this.o.offsetTop);
        else if (x != null) {
            this.o.style.left = x + "px";
            return this;
        } else {
            this.o.style.top = y + "px";
            return this;
        }
    }

    hide() {
        this.o.style.display = "none";
        return this;
    }
    attr(attrName: string, attrVal: any = null): Elem | any {
        if (attrVal != null) {
            this.o.setAttribute(attrName, attrVal);
            return this;
        } else {
            this.o.getAttribute(attrName);
        }
    }
    show() {
        this.o.style.display = "block";
        return this;
    }

    move(dx: number, dy: number) {
        let left = this.o.offsetLeft;
        let top = this.o.offsetTop;
        console.log(left, top, dx, dy)
        this.o.style.left = (left + dx) + "px";
        this.o.style.top = (top + dy) + "px";
        return this;
    }

    hover(inFunc: (MouseEvent) => any, outFunc: null | ((MouseEvent) => any) = null): Elem {
        this.o.addEventListener("mouseenter", inFunc);
        if (outFunc != null) {
            this.o.addEventListener("mouseleave", outFunc);
        }
        return this;
    }
}