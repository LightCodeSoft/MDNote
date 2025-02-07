// import Elem from "../layout/Elem"
import Elem from "../layout/Elem";
import addRippleEffect from "../tools/RippleEffect"

export enum ButtonType {
    OK = 0,
    Cancel,
}
const Cls = ["ok-button", "cancel-button"]

export default class Button extends Elem {

    onClickListener: any = null;
    constructor(text: string = "Button", type = ButtonType.OK) {
        super("button", Cls[type]);
        this.o.innerHTML = text;
        addRippleEffect(this);
    }
    setOnClickListener(func): Elem {
        this.onClickListener = func;
        super.setOnClickListener(func)
        return this;
    }
    // setOnClickListener(func: any): void {
    //     this.onClickListener = func;
    //     super.setOnClickListener(func)
    // }

}