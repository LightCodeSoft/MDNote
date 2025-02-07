import Elem from "../layout/Elem" 

export default class Radio extends Elem {
    val: any = null;
    onChangeListener: any = null;
    constructor(name: string, nameValMap: Record<string, any>, onChangeListener: any = null) {
        super("radio");
        this.onChangeListener = onChangeListener;
        this.initChild(name, nameValMap) 
    }
    initChild(name: string, nameValMap: Record<string, any>,) {
        var isFirst = true;
        let self = this;
        for (var dname in nameValMap) {
            let val = nameValMap[dname];
            if (isFirst) this.val = val;
            let label = document.createElement("span");
            label.innerHTML = `
            <input type="radio" value="${val}" name="${name}" ${isFirst ? 'checked="checked"' : ""} />
            <span>${dname}</span>
            `
            this.addChild(label)

            label.onclick = function (e) {
                let thiz = this as HTMLElement;
                let radio = thiz.children[0] as HTMLInputElement;
                radio.checked = true;
                self.onClickRadio(radio.value);
            };
            isFirst = false;
        }
    }
    getVal() {
        return this.val;
    }
    onClickRadio(val) {
        let old = this.val;
        if (val != old) {
            this.val = val;
            if (this.onChangeListener) {
                this.onChangeListener(val, old);
            }
        }
    }

}