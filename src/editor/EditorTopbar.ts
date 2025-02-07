import Box, { BoxCfg } from "../layout/Box";
import EditorPreview, { EditorMode } from "./EditorPreview";
import { registerClickSwitch, OnSwitchModuleListener } from "../tools/ClickSwitchMngr"
import { EvtListener, registerEvt, sendEvt } from "../tools/EvtMngr";
import * as Const from "../tools/Const";
import Popup from "../widget/Popup"
import Elem from "../layout/Elem";
const MidIcon = '<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect id="Rectangle-4" x="0" y="0" width="16" height="16"></rect> <path d="M15,1 C15.5522847,1 16,1.44771525 16,2 L16,14 C16,14.5522847 15.5522847,15 15,15 L1,15 C0.44771525,15 0,14.5522847 0,14 L0,2 C0,1.44771525 0.44771525,1 1,1 L15,1 Z M7.001,3 L2,3 L2,13 L7.001,13 L7.001,3 Z M14,3 L9.001,3 L9.001,13 L14,13 L14,3 Z" " fill="currentColor" fill-rule="nonzero"></path></g></g></svg>'
const RightIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16px" height="16px"><g xmlns="http://www.w3.org/2000/svg" transform="matrix(0 -1 1 0 -0 16)"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect id="Rectangle-4" x="0" y="0" width="16" height="16"></rect><path d="M15,1 C15.5522847,1 16,1.44771525 16,2 C16,2.51283584 15.6139598,2.93550716 15.1166211,2.99327227 L15,3 L1,3 C0.44771525,3 0,2.55228475 0,2 C0,1.48716416 0.38604019,1.06449284 0.883378875,1.00672773 L1,1 L15,1 Z" fill="currentColor" fill-rule="nonzero"></path><path d="M15,5 C15.5522847,5 16,5.44771525 16,6 L16,14 C16,14.5522847 15.5522847,15 15,15 L1,15 C0.44771525,15 0,14.5522847 0,14 L0,6 C0,5.44771525 0.44771525,5 1,5 L15,5 Z M14,7 L2,7 L2,13 L14,13 L14,7 Z" fill="currentColor"  ></path></g></g></g></svg>'
const LeftIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16px" height="16px"><g xmlns="http://www.w3.org/2000/svg" transform="matrix(0 1 -1 0 16 -0)"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect id="Rectangle-4" x="0" y="0" width="16" height="16"></rect><path d="M15,1 C15.5522847,1 16,1.44771525 16,2 C16,2.51283584 15.6139598,2.93550716 15.1166211,2.99327227 L15,3 L1,3 C0.44771525,3 0,2.55228475 0,2 C0,1.48716416 0.38604019,1.06449284 0.883378875,1.00672773 L1,1 L15,1 Z" fill="currentColor" fill-rule="nonzero"></path><path d="M15,5 C15.5522847,5 16,5.44771525 16,6 L16,14 C16,14.5522847 15.5522847,15 15,15 L1,15 C0.44771525,15 0,14.5522847 0,14 L0,6 C0,5.44771525 0.44771525,5 1,5 L15,5 Z M14,7 L2,7 L2,13 L14,13 L14,7 Z" fill="currentColor"  ></path></g></g></g></svg>'
export default class EditorTopBar extends Box implements OnSwitchModuleListener, EvtListener {
    title: string = "";
    clickTimes = 0;
    lastClickTime = 0;
    isSaved: boolean = true;
    path: string = "";
    titleElem: Elem;
    leftIcon: Elem;
    midIcon: Elem;
    rightIcon: Elem;

    constructor(cfg: BoxCfg | null = null) {
        super(cfg, "editorTopBar")
        this.css("user-select", "text")
        let self = this;
        // this.setOnClickListener(function (e) { self.onClick(e); })
        this.titleElem = new Elem("div");
        let iconsGroup = new Elem("div");

        this.leftIcon = new Elem("div", "leftIcon").addChild(LeftIcon).setOnClickListener(function () { self.setEidtPreviewMode(EditorMode.Edit) })
        this.midIcon = new Elem("div", "midIcon").addChild(MidIcon).setOnClickListener(function () { self.setEidtPreviewMode(EditorMode.EditPreview) })
        this.rightIcon = new Elem("div", ["rightIcon","selEditorTopIcon"]).addChild(RightIcon).setOnClickListener(function () { self.setEidtPreviewMode(EditorMode.Preview) })

        iconsGroup.addChild(this.leftIcon).addChild(this.midIcon).addChild(this.rightIcon)

        this.addChild(this.titleElem).addChild(iconsGroup)
        registerClickSwitch(this)
        registerEvt([Const.OnEditing, Const.OnSaveFile, Const.CheckFileSaved], this);
    }
    setEidtPreviewMode(mode: EditorMode) {
        sendEvt(Const.ToggleEditPreviewMode, { "mode": mode })

        this.leftIcon.removeClass("selEditorTopIcon")
        this.midIcon.removeClass("selEditorTopIcon")
        this.rightIcon.removeClass("selEditorTopIcon")

        if (mode == EditorMode.Edit) {
            this.leftIcon.addClass("selEditorTopIcon")
        } else if (mode == EditorMode.EditPreview) {
            this.midIcon.addClass("selEditorTopIcon")
        }
        else {
            this.rightIcon.addClass("selEditorTopIcon")
        }
    }
    // protected onClick(e): boolean {
    //     sendEvt(Const.ToggleEditPreviewMode)
    //     return false;
    // }
    onEvt(name: any, data: any) {
        if (name == Const.OnEditing) {
            this.setIsSaved(false);
        } else if (name == Const.OnSaveFile) {
            this.setIsSaved(true);
        } else if (name == Const.CheckFileSaved) {
            data.cb && data.cb(this.isSaved)
        }
    }
    setIsSaved(isSaved) {
        this.isSaved = isSaved;
        this.css("color", isSaved ? "#000" : "#f00")
        this.titleElem.o.innerHTML = isSaved ? this.title : "*" + this.title;

    }
    isSelected() {
        throw new Error("Method not implemented.");
    }
    onSwitchChange(isFocus): void {
    }
    getTar(): HTMLElement {
        return this.o;
    }
    show() {
        this.o.style.display = "flex";
        return this;
    }
    setTitle(title, path) {
        this.title = title;
        this.path = path;
        this.titleElem.o.innerHTML = title;
        this.titleElem.attr("title", path)
        this.setIsSaved(true)
        this.setEidtPreviewMode(EditorMode.Preview)
    }

}