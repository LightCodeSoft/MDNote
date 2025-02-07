import Elem from "../layout/Elem"
import Button, { ButtonType } from "./Button";
const X = '<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>'
export default class Popup {
    private static _bg: Elem;
    private static dialogRoot: Elem;
    private static titleRoot: Elem;
    private static contentRoot: Elem;
    private static closeBtn: Elem;
    private static cancelBtn: Elem;
    private static okBtn: Elem;


    private static initPopup() {
        if (!Popup._bg) {
            let id = "__pyui_pop_bg";
            let root = document.getElementById(id);
            if (!root) {
                Popup._bg = new Elem("div")
                Popup._bg.attr("id", id)
                let root = new Elem("div", "__pyui_pop_dialog_root")
                let header = new Elem("div", "__pyui_pop_dialog_header")
                let titleRoot = new Elem("div", "__pyui_pop_dialog_title")
                let closeBtn = new Elem("span", "__pyui_pop_dialog_close")
                closeBtn.setOnClickListener(function (e) { return false; })
                closeBtn.addChild(X)
                header.addChild(titleRoot)
                header.addChild(closeBtn);
                let footer = new Elem("div", "__pyui_pop_dialog_footer")
                let cancel = new Button("取消", ButtonType.Cancel)
                let ok = new Button("确定", ButtonType.OK)
                footer.addChild(cancel)
                footer.addChild(ok)

                let contentRoot = new Elem("div", "__pyui_pop_dialog_content")
                root.setOnClickListener(function (e) { e.preventDefault(); e.stopPropagation(); })
                root.addChild(header)
                root.addChild(contentRoot);
                root.addChild(footer);
                Popup._bg.addChild(root);
                document.body.appendChild(Popup._bg.o as HTMLElement);

                Popup.titleRoot = titleRoot
                Popup.contentRoot = contentRoot
                Popup.okBtn = ok;
                Popup.dialogRoot = root;
                Popup.cancelBtn = cancel;
                Popup.closeBtn = closeBtn;
            }
        }
    }

    private static hide() {
        Popup.dialogRoot.addClass("__pyui_pop_dialog_root_hide")
        setTimeout(function () {
            Popup._bg.hide();
        }, 300)
    }

    static newDialog(content, title, onOk, onCancel) {
        Popup.initPopup();
        if (!onCancel)
            Popup.cancelBtn.hide();
        else
            Popup.cancelBtn.show();
        Popup.dialogRoot.removeClass("__pyui_pop_dialog_root_hide")
        Popup._bg.show();
        Popup.titleRoot.o.innerHTML = title
        Popup.contentRoot.o.innerHTML = content;
        Popup.okBtn.o.onclick = function () {
            Popup.hide(); onOk && onOk()
        };
        function close(e) {
            Popup.hide()
            onCancel && onCancel(e);
        }
        // Popup._bg.o.onclick = close;
        Popup.closeBtn.o.onclick = close;
        Popup.cancelBtn.o.onclick = close;
    }

    static confirm(prompt, onOk, onCancel = null) {
        Popup.newDialog(prompt, "提示", onOk, function () { onCancel && onCancel() })
    }
    static alert(msg) {
        Popup.newDialog(msg, "警告", null, null)
    }

}