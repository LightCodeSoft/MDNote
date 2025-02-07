import Elem from "../layout/Elem"


export default class Input extends Elem {
    type: string;
    val: any = null;
    onChangeListener: any = null;
    constructor(type: string = "text", placeholder: string = "", editable: boolean = true, onChangeListener: any = null) {
        super("input", "__pyui_input");
        this.type = type;
        this.onChangeListener = onChangeListener;
        this.attr("type", type);
        this.attr("placeholder", placeholder);
        if (!editable) {
            this.attr("readonly", true)
        }
        this.initEvts(this.o) 
    }

    initEvts(input) {

        function trigger(el, type) {
            let e = document.createEvent('HTMLEvents')
            e.initEvent(type, true, false)
            el.dispatchEvent(e)
        }
        input.addEventListener('compositionstart', function (e) {
            e.target.composing = true
        })

        input.addEventListener('compositionend', function (e) {
            e.target.composing = false
            // 输入完成后触发input事件
            trigger(e.target, 'input')
        })
        let self = this;
        input.addEventListener('input', function (e) {
            // 避免输入拼音的时候触发该事件
            if (e.target.composing) {
                return
            }
            self.onChangeListener(e.target.value)

        })
    }

    getVal() {
        return this.val;
    }
    onValChange(val: any) {

        this.val = val;
        if (this.onChangeListener) {
            this.onChangeListener(val);
        }

    }
}