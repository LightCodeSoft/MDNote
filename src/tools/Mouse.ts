import Elem from "../layout/Elem"

function disableAllIframeMouseMove() {
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; ++i) {
        iframes[i].style["pointer-events"] = "none";
    }
}
function enableAllIframeMouseMove() {
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; ++i) {
        iframes[i].style["pointer-events"] = "auto";
    }
}
export default class Mouse {
    private tar: Elem;
    private canMove: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private cursor: string;
    private dragingClassName: string | null = null;

    constructor(tar: Elem, cursor: string = "move", dragingClassName: string | null = null) {
        this.tar = tar;
        this.cursor = cursor;
        this.dragingClassName = dragingClassName;
    }
    onStartState() {
        if (this.dragingClassName != null)
            this.tar.addClass(this.dragingClassName)
        document.body.style.cursor = this.cursor;
    }
    onStopState() {
        if (this.dragingClassName != null)
            this.tar.removeClass(this.dragingClassName)
        document.body.style.cursor = "default";
    }
    triggerMouseEvent(node, eventType, isLeft: boolean = true) {
        var clickEvent = new MouseEvent(eventType, { bubbles: true, cancelable: true, button: isLeft ? 0 : 2 });
        node.dispatchEvent(clickEvent);
    }
    isLeaveBrowser(e: MouseEvent) {
        return e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight);
    }
    /**
     * useLeft:true使用左键, false右键
     * **/
    addDrag(onDrag: (dx: number, dy: number, lastX: number, lastY: number) => void,
        useLeft: boolean = true,
        relativeDown: boolean = false,
        onBeginDrag: ((dx: number, dy: number) => void) | null = null): Mouse {
        let self = this;
        let button = useLeft ? 0 : 2;
        function onmousemove(e: MouseEvent) {
            if (e.button != button) {
                self.onStopState()
                self.canMove = false;
                return;
            }
            let inWeb = true;
            //验证是否离开浏览器
            if (self.isLeaveBrowser(e)) {
                inWeb = false;
                return;
            }
            if (self.canMove == true && inWeb) {
                var dx = e.pageX - self.lastX;
                var dy = e.pageY - self.lastY;
                if (!relativeDown) {
                    self.lastX = e.pageX;
                    self.lastY = e.pageY;
                }
                onDrag(dx, dy, self.lastX, self.lastY);
            }
        }
        function onmouseup(e: MouseEvent) {
            if (e.button != button) return;
            enableAllIframeMouseMove();
            self.onStopState()
            self.canMove = false;
            e.preventDefault();
            window.removeEventListener("mousemove", onmousemove);
            window.removeEventListener("mouseup", onmouseup);

        };
        this.tar.o?.addEventListener("mousedown", function (e: MouseEvent) {
            if (e.button != button) return;
            disableAllIframeMouseMove();
            window.addEventListener("mousemove", onmousemove);
            window.addEventListener("mouseup", onmouseup);
            // window.addEventListener('mouseleave', onLeaveWeb);

            self.canMove = true;
            // 在鼠标按键按下时记录鼠标相对于元素本身的坐标
            self.lastX = e.pageX;
            self.lastY = e.pageY;
            if (onBeginDrag != null) onBeginDrag(self.lastX, self.lastY);
            self.onStartState()
        });

        return this;
    }

    static clearSelection(win, doc) {
        if (doc.selection && doc.selection.empty) {
            doc.selection.empty();
        } else if (win.getSelection) {
            var sel = win.getSelection();
            sel.removeAllRanges();
        }
    }
}