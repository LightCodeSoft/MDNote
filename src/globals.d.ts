
export { };

declare enum FileDirFilter {
    None = 0,
    OnlyFile = 1,
    OnlyDir = 2
}
type Integer = number;
interface NativeInterface {

    openDevTools(): void;
    bindDragWin(obj: HTMLElement): void;
    readFile(path: string): string;
    writeFile(path: string, content: string): boolean;
    system(cmd: string): string;
    addSysPath(path: string): void;
    alert(msg: string);

    getAppRoot(): string;
    getExeDir(): string;

    invokeDll(dllFileName: string, funcName: string, proto: string, ...args): any;
    addNativeMsgListener(type: string, cb: Function);

    addFileDragListener(cb: Function);

    //append: default is false
    setEnv(name: string, val: string, append?: boolean): void;
    //default filter is None
    listdir(dir: string, filter?: FileDirFilter): string[];
    mkdirs(dirpath: string): boolean;
    exists(path: string): boolean;
    openInExplorer(path: string): boolean;
    rename(path: string, newName: string): boolean;
    delPath(path: string): boolean;
    createFile(path: string): boolean;
    exitApp();
    showTray(iconPath: string, title: string, items: Map<Integer, string>, callback: (data: any) => void): void;
    //default:defaultDirPath="", multiSelect=true, onlyFolder=false
    openFileSelector(defaultDirPath?: string, multiSelect?: boolean, onlyFolder?: boolean): string[];

    showWindow(): void;
    hideWindow(): void;
    minWindow(): void;
    maxWindow(): void;
    normalWindow(): void;
    isWindowMaximized(): boolean;
    isWindowVisible(): boolean;
    hookKeyboad(callback: (data: any) => void);
    setOnClickCloseIconListener(listener: () => void): void;

}
declare global {
    interface Window {
        Native: NativeInterface; // 替换为实际的类型
    }
}