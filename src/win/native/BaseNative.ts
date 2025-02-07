
// import { sendEvt, registerEvt, EvtListener } from "../../tools/EvtMngr"
// import MDDemoText from "../../editor/utils/constant"
// import * as Const from "../../tools/Const"
// import Path from "../../tools/Path";
// import Popup from "../../widget/Popup";
// import { data } from "jquery";

// export default class BaseNative implements EvtListener {
//     private evtMap: any;

//     constructor() {
//         this.evtMap = {}
//         this.evtMap[Const.PasteFile] = this.copyFile;
//         // this.evtMap[Const.OnWebLoad] = this.onWebLoad;
//         this.evtMap[Const.OpenInExplorer] = this.openInExplorer;
//         // this.evtMap[Const.ReqOpenFile] = this.readFile;
//         this.evtMap[Const.ReqSaveFile] = this.saveFile;
//         this.evtMap[Const.ReqRename] = this.rename;
//         this.evtMap[Const.ReqNewFileFolder] = this.newFileFolder;
//         this.evtMap[Const.ReqDelPath] = this.delete;
//         this.evtMap[Const.ReqOpenURL] = this.openURL;
//         this.evtMap[Const.ReqOpenDirDialog] = this.openDirDialog;
//         this.evtMap[Const.Exit] = this.exit;
//         this.evtMap[Const.ReqCapture] = this.capture;
//         this.evtMap[Const.CopyText] = this.copyText;
//         this.evtMap[Const.ReadClipboardText] = this.readClipboardText;
//         this.evtMap[Const.GetFolderList] = this.getFolderList;
//         this.evtMap[Const.GetMDList] = this.getMDList;
//         this.evtMap[Const.GetCfgRoot] = this.getCfgRoot;
//         this.evtMap[Const.ReadFile] = this.readFile;


//         registerEvt(Object.keys(this.evtMap), this);
//     }

//     onEvt(name: any, data: any) {
//         this.evtMap[name](data, this);
//     }
//     readFile(data, self) {
//         console.log("readFile from ", data.p);
//         let out = {};
//         if (data.p.endsWith(".md")) {
//             out = { rs: true, "path": data.p, "content": MDDemoText }
//         } else {
//             out = { rs: true, "path": data.p, "content": '{"root_dir":"C:/Users/huachao/Desktop/test"}' }
//         }
//         console.log("file content:", out)
//         data && data.cb && data.cb(out)
//     }
//     getFolderList(data, self) {
//         console.log("getFolderList from ", data.root);
//         let out = [{ n: "folder 1", p: "path/to/folder1" },
//         { n: "folder 2", p: "path/to/folder2" },
//         { n: "folder 3", p: "path/to/folder3" },
//         { n: "folder 4", p: "path/to/folder4" }]
//         data && data.cb && data.cb(out)
//     }
//     getCfgRoot(data, self) {
//         console.log("getCfgRoot ");
//         let root = "/root/workspace"
//         data && data.cb && data.cb({ rs: true, root: root });
//     }
//     getMDList(data, self) {
//         console.log("getMDList from ", data.root);
//         let out = [{ n: "file 1.md", p: "path/to/file1.md" },
//         { n: "file 2.md", p: "path/to/file2.md" },
//         { n: "file 3.md", p: "path/to/file3.md" },
//         { n: "file 4.md", p: "path/to/file4.md" }]
//         data && data.cb && data.cb(out)
//     }
//     readClipboardText(data, self) {
//         console.log("readClipboardText");
//     }
//     copyText(t, self) {
//         console.log("copy text", t);
//     }
//     openDirDialog(data, self) {
//         console.log("opendirDialog...")
//     }
//     exit(data, self) {
//         console.log("exit...")
//     }
//     openURL(url, self) {
//         window.open(url, "_blank");
//     }
//     copyFile(data, self) {
//         console.log("paste file src:", data.src, "dst:", data.dst);
//         let name = Path.getName(data.src);
//         let isFolder = !name.toLowerCase().endsWith(".md")
//         let rsp = { "rs": true, "fn": name, "path": data.dst, "isFolder": isFolder }
//         data.cb && data.cb(rsp);
//     }
//     openInExplorer(path, self) {
//         console.log("open Explorer")
//     }
//     // onWebLoad(root, self) {
//     //     // self.loadFileTree(root, self)
//     //     self.getFolderList
//     // }
//     // readFile(path, self) {
//     //     sendEvt(Const.OnOpenFile, { "path": path, "content": MDDemoText })
//     // }
//     saveFile(data, self) {
//         console.log("save", data.path)
//         data.cb && data.cb(true)
//         sendEvt(Const.OnSaveFile, data.path);
//     }
//     // loadFileTree(root, self) {
//     //     let tree = [
//     //         {
//     //             n: "文件夹2",
//     //             path: "C:/to/path/文件夹2",
//     //             childs: [
//     //                 {
//     //                     n: "文件3.MD",
//     //                     path: "C:/to/path/文件夹2/文件3.md"
//     //                 }

//     //             ]
//     //         },
//     //         {
//     //             n: "文件1",
//     //             path: "C:/to/path/文件1.md",
//     //             childs: []
//     //         }

//     //     ]
//     //     sendEvt(Const.OnLoadRootDir, tree);
//     // }
//     rename(data, self) {
//         let root = Path.getParent(data.path)
//         let np = Path.join(root, data.name)
//         let out = { np: np };
//         console.log("rename", out)

//         data.cb && data.cb(out)
//     }


//     newFileFolder(data, self) {
//         console.log(data)
//         data.cb && data.cb({ rs: true })

//     }
//     delete(data, self) {
//         Popup.confirm("是否确认删除文件" + data.path, function () {
//             data.cb && data.cb({ rs: true })
//         })
//     }
//     capture(data, self) {//截屏

//         console.log("capture")
//     }

// }