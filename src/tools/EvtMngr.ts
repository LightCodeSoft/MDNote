

const __EvtCenter = {

}
export interface EvtListener {
    onEvt(name, data);
}
export function sendEvt(name, data: any = null) {
    let list = __EvtCenter[name];
    // if(name==2) console.log(list)
    if (!list) return;
    list.forEach(function (tar) {
        tar.onEvt(name, data);
    })

}
function registerEvtOne(name, tar: EvtListener) {
    // console.log("regist", name, tar)
    if (!__EvtCenter[name]) __EvtCenter[name] = [tar];
    else __EvtCenter[name].push(tar)
}
export function registerEvt(name, tar: EvtListener) {
    if (!Array.isArray(name)) {
        registerEvtOne(name, tar)
    } else {
        name.forEach(function (n) {
            // console.log("arr regist:",n, name)
            registerEvtOne(n, tar);
        })
    }
}