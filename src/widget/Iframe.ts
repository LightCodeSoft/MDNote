import Elem from "../layout/Elem"

export default class Iframe extends Elem {
    public iwin: Window | null = null;
    public idoc:Document;
    constructor(html, className: string | string[] | null = null, onloadCB=null) {
        super("iframe", className);
        this.init(html, onloadCB);
    }

    init(html, onloadCB) { 
        let iframe = this.o as HTMLIFrameElement
        if(onloadCB){
            let self = this;
            iframe.onload = function () { 
                self.iwin = iframe.contentWindow
                self.idoc =  iframe.contentWindow.document;
                onloadCB(self);

            }
        }
        document.addEventListener("DOMContentLoaded", () => { 
            let iwindow = iframe.contentWindow;
            iwindow?.document.open();
            iwindow?.document.write(html);
            iwindow?.document.close(); 
        }); 
    }
     
}