/// <reference path="../globals.d.ts" />

const Native = window.Native;
export default class Settings {

    private static instance: Settings;
    private workspace: string;
    public setWorkspace(ws:string):void{
        this.workspace = ws.trim();
    }
    public getWorkspace() {
        return this.workspace;
    }
    public save(): void {
        let cfgPath = Native.getAppRoot() + "\\settings.json";
        let cfg = { "workspace": this.workspace.trim() }
        let str = JSON.stringify(cfg);
        Native.writeFile(cfgPath, str);
    }
    private getValue(json,key,defaultVal){
        if(key in json) return json[key];
        else return defaultVal;
    }
    private constructor() {
        let cfgPath = Native.getAppRoot() + "\\settings.json";
        let cfg = Native.readFile(cfgPath);
        cfg = cfg.trim();
        if (cfg.length > 0) {
            try {
                let json = JSON.parse(cfg);
                this.workspace = this.getValue(json, "workspace", "").trim();
            } catch (e) {
                console.log(e);
            }
        } else {//set default values
            this.workspace = "";
        }
    }
    // 静态方法用于获取实例
    public static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }
}