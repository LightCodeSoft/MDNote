// import BaseNative from "./BaseNative"
// import { sendEvt, registerEvt, EvtListener } from "../../tools/EvtMngr"
// import * as Const from "../../tools/Const"
// import Popup from "../../widget/Popup";

// var Mapper = {}
// var idx = 0;
// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// function nextKey() {
//     idx += 1;
//     return "" + idx + getRandomInt(100000);
// }

// export default class Native extends BaseNative {
//     constructor() {
//         super()
//         window.chrome.webview.addEventListener("message", (e) => {
//             if (e && e.data) {
//                 console.log("callback:", e.data)
//                 var data = JSON.parse(e.data);
//                 if (data.k && Mapper[data.k]) {
//                     var resolve = Mapper[data.k];
//                     delete data.k;
//                     resolve(data.rs);
//                     delete Mapper[data.k];
//                 }
//             }
//         })
//     }
//     invoke(funName, args = {}) {
//         console.log(".....invoke.....", funName)
//         // var key = nextKey();
//         // var data = { k: key, f: funName, args: args }
//         // console.log("native:", funName)
//         // return new Promise((resolve, reject) => {
//         //     Mapper[key] = resolve;
//         //     window.chrome.webview.postMessage(JSON.stringify(data));
//         // });
//     }

//     // listdir(data, self) {
//     //     return
//     //     // self.invoke("getFolderList", { root: data.root }).then(function (rs) {
//     //     //     data && data.cb && data.cb(rs);
//     //     // });
//     // }
//     getCfgRoot(data, self) {
//         var appRoot = WinJS.getAppRoot();
//         // var cfgPath = appRoot + "\\config.json";
//         var out = { "rs": true, "root": appRoot }
//         data && data.cb && data.cb(out);
//         // console.log("getCfgRoot ");
//         // let root = "/root/workspace"
//         // data && data.cb && data.cb({ rs: true, root: root });
//         // self.invoke("getCfgRoot").then(function (rs) {
//         //     console.log("getCfgRoot", rs)
//         //     data && data.cb && data.cb(rs);
//         // });
//     }
//     getMDList(data, self) {
//         self.invoke("getMDList", { root: data.root }).then(function (rs) {
//             data && data.cb && data.cb(rs);
//         });
//         // console.log("getMDList from ", data.root);
//         // let out = [{ n: "file 1.md", p: "path/to/file1.md" },
//         // { n: "file 2.md", p: "path/to/file2.md" },
//         // { n: "file 3.md", p: "path/to/file3.md" },
//         // { n: "file 4.md", p: "path/to/file4.md" }]
//         // data && data.cb && data.cb(out)
//     }
//     readClipboardText(data, self) {
//         self.invoke("readClipboardText").then(function (rs) {
//             data && data.cb && data.cb(rs.t);
//         });
//     }
//     copyText(t, self) {
//         self.invoke("copyText", { t: t });
//     }

//     openURL(url, self) {
//         self.invoke("openURL", { url: url })
//     }

//     copyFile(data, self) {
//         self.invoke("copyFile", { s: data.src, d: data.dst }).then(function (rs) {
//             data.cb && data.cb(rs)
//         })
//         // __pasteFile(data.src, data.dst).then(function (rs) {
//         //     data.cb && data.cb(rs)
//         // })
//     }
//     // loadFileTree(root, self) {
//     //     self = self || this;
//     //     console.log("load root>>", root)
//     //     var args = {};
//     //     if (root) args = { root: root }
//     //     self.invoke("loadFileTree", args).then(function (data) {
//     //         sendEvt(Const.OnLoadRootDir, data);
//     //     })
//     // }
//     rename(data, self) {
//         self.invoke("rename", { p: data.path, nn: data.name }).then(function (rs) {
//             data.cb && data.cb(rs)
//         })
//         // __rename(data.path, data.name).then(function (rs) {
//         //     data.cb && data.cb(rs)
//         // })
//     }

//     newFileFolder(data, self) {
//         if (data.isFolder) {
//             self.invoke("newFolder", { p: data.dir + "/" + data.name }).then(function (rs) {
//                 data.cb && data.cb(rs)
//             })
//             // __newFolder(data.dir + "\\" + data.name).then(function (rs) {
//             //     data.cb && data.cb(rs)
//             // })

//         } else {
//             self.invoke("newFile", { p: data.dir + "/" + data.name }).then(function (rs) {
//                 data.cb && data.cb(rs)
//             })
//             // __newFile(data.dir + "\\" + data.name).then(function (rs) {
//             //     data.cb && data.cb(rs)
//             // })
//         }

//     }
//     readFile(data, self) {
//         var content = WinJS.readFile(data.p);
//         var rs = { "path": data.p, "content": content, "rs": true };
//         data && data.cb && data.cb(rs)
//         // self.invoke("readFile", { p: data.p }).then(function (rs) {
//         //     rs["path"] = data.p;
//         //     data && data.cb && data.cb(rs)
//         //     // sendEvt(Const.OnOpenFile, { "path": path, "content":  rs.content, "rs": rs.rs })
//         // })
//     }
//     openInExplorer(path, self) {
//         self.invoke("openInExplorer", { p: path })
//     }
//     delete(data, self) {
//         Popup.confirm("是否确认删除文件" + data.path, function () {
//             // __delete(data.path).then(function (rs) { data.cb && data.cb(rs) })
//             self.invoke("delFile", { p: data.path }).then(function (rs) { data.cb && data.cb(rs) })

//         })

//     }
//     saveFile(data, self) {

//         self.invoke("saveFile", { p: data.path, c: data.content }).then(function (rs) {
//             data.cb && data.cb(rs)
//             sendEvt(Const.OnSaveFile, data.path);
//         })
//         // __saveFile(data.path, data.content).then(function (rs) {
//         //     data.cb && data.cb(rs)
//         //     sendEvt(Const.OnSaveFile, data.path);
//         // })
//     }
//     openDirDialog(data, self) {
//         self.invoke("openDirDialog", {}).then(function (rs) {
//             if (rs.rs) {
//                 data && data.cb && data.cb(rs);//self.loadFileTree(rs.p, self);
//                 // sendEvt(Const.OnLoadRootDir, rs.p);
//             }
//         });
//         // __openDirDialog().then(function (rs) {

//         //     __loadFileTree(rs).then(function (data) {
//         //         sendEvt(Const.OnLoadRootDir, data);
//         //     })
//         // })
//     }
//     exit(data, self) {
//         self.invoke("exit", {});
//     }
//     capture(data, self) {
//         self.invoke("capture", {});
//     }
// }
