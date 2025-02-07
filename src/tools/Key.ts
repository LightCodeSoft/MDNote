import { OnSwitchModuleListener } from "./ClickSwitchMngr";
import { sendEvt } from "../tools/EvtMngr"
import * as Const from "../tools/Const"


const TarList = []
export interface OnKeyDownListener extends OnSwitchModuleListener {
    onKeyDown(e);
}
export default class Key {
    static registerKeydown(tar: OnKeyDownListener) {
        TarList.push(tar)
    }

    static handleEvent(e) {
        TarList.forEach(function (tar) {
            if (tar.isSelected()) {
                if (tar.isSelected()) {
                    if (!tar.onKeyDown(e)) {
                        e.preventDefault();
                        e.returnValue = false;
                    }
                }
            }
        })

        if (e.ctrlKey && e.key === 's') {

            e.preventDefault();
            e.returnValue = false;
            sendEvt(Const.OnKeydownSave)
        }

    }
    static initKeyListener() {
        window.addEventListener('keydown', Key.handleEvent)
    }
}