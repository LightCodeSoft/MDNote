

export interface OnSwitchModuleListener {
    onSwitchChange(isFocus): void;
    getTar(): HTMLElement;
    isSelected();
}

const TarList: OnSwitchModuleListener[] = [];
var _curSelectTarModule: OnSwitchModuleListener | null = null;

function notifyAll(listener: OnSwitchModuleListener) {

    TarList.forEach(function (elem) {
        elem.onSwitchChange(elem == listener);
    })
}

export function registerClickSwitch(listener: OnSwitchModuleListener) {
    TarList.push(listener)
    let tar = listener.getTar();
    tar.addEventListener("click", function () {
        _curSelectTarModule = listener;
        notifyAll(listener);
    })
}