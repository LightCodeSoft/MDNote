import WinMain from "./win/WinMain"
import Settings from "./win/Settings"
import Popup from "./widget/Popup";
let _win = null;
const Native = window.Native;

function initGUI() {
    _win = new WinMain()
}


function capture() {
    let exeDir = Native.getExeDir();
    let captureName = "ScreenCapture.exe"
    let capturePath = exeDir + "\\" + captureName;
    if (Native.exists(capturePath)) {
        Native.system(capturePath);
    } else {
        Native.alert("截图软件不存在！请将截图软件存放在" + exeDir + "中，\n并命名为" + captureName);
    }
}

function onTrayMsg(msgData) {
    let itemId = msgData.itemId;
    if (itemId == 1) {//打开
        Native.showWindow();
    } else if (itemId == 2) {//截图
        capture();
    } else if (itemId == 3) {//退出
        Native.exitApp();
    }
}

let shiftPressed = false;
let ctrlPressed = false;
function onKey(data) {
    let isDown = data.type == "keydown";
    let code = data.code;
    if (code == 160) {//shift
        shiftPressed = isDown;
    } else if (code == 162) {//ctrl
        ctrlPressed = isDown;
    } else if (code == 65) {//a
        if (isDown && shiftPressed && ctrlPressed) {
            capture();
        }
    }
}

function init() {
    initGUI();
    Native.openDevTools();//for debug
    Native.hookKeyboad(onKey);
    Native.setOnClickCloseIconListener(function () {
        // Popup.confirm("是否确定退出？", function () { Native.exitApp() });
        Native.hideWindow();
    })
    let items = new Map();
    items.set(1, "打开");
    items.set(2, "截图");
    items.set(0, "");
    items.set(3, "退出");
    Native.showTray("favicon.ico", "Markdown笔记", items, onTrayMsg);
}
export function openDir(root, save_to_cfg = false) {
    let settings = Settings.getInstance();
    _win.openDir(root)
    settings.setWorkspace(root)
    if (save_to_cfg) {
        settings.save();
    }
}
// export function parseDragUrl(url) {
//     if (url.startsWith("file:///"))
//         url = url.substring(8)
//     let path = decodeURIComponent(url)
//     path = Path.standarPath(path)
//     return path

// }
// export function openFile(path) {
//     _win.openFile(path)
// }
init();
document.addEventListener("DOMContentLoaded", function () {

    // function onReadCfg(data) {
    //     if (data.rs && data.content.trim().length > 0) {
    //         try {
    //             let cfg = JSON.parse(data.content);

    //             if (cfg.root_dir) {
    //                 openDir(cfg.root_dir, false)
    //             }
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    // }
    // function onGetCfgRoot(data) {
    //     if (data.rs) {
    //         let root = data.root;
    //         let p = root + "/settings.json";

    //         sendEvt(Const.ReadFile, { p: p, cb: onReadCfg })
    //     }
    // }
    //listener for the direct drag
    Native.addFileDragListener(function (path, isDir) {
        if (isDir)
            openDir(path, true);
    })
    let workspace = Settings.getInstance().getWorkspace();
    if (workspace.length > 0) {
        openDir(workspace, false);
    }
    // sendEvt(Const.GetCfgRoot, { cb: onGetCfgRoot })
})