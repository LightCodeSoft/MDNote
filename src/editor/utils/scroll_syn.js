
//参考这个实现精确同步https://juejin.cn/post/7100562751596003342

let _cmElemList = [];
let _previewElemList = [];

function computePosition(cm, preview) {
    _cmElemList = [0];
    _previewElemList = [0];
    var reg = /^[h|H][0-9]+$/
    for (var i = 0; i < preview.childNodes.length; ++i) {
        var tname = preview.childNodes[i].tagName;
        if (!tname) continue;
        var n = tname.search(reg);
        if (n >= 0) {
            _previewElemList.push(preview.childNodes[i].offsetTop)
        }
    }
    var lines = cm.getValue().split("\n")
    reg = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/
    for (var i = 0; i < lines.length; ++i) {
        var n = lines[i].search(reg);
        if (n >= 0) {
            var top = cm.heightAtLine(i, "local");
            _cmElemList.push(top);
        }
    }
    if (_cmElemList.length != _previewElemList.length) {
        _cmElemList = [0], _previewElemList = [0];
    }
    if (lines.length > 0 && preview.childNodes.length > 0) {//补一个最后的 
        var top = cm.heightAtLine(lines.length - 1, "local");
        _cmElemList.push(top);
        _previewElemList.push(preview.childNodes[preview.childNodes.length - 1].offsetTop)
    }
    // console.log(_cmElemList, _previewElemList)
}

let isScrollCM = false;

function onEditScroll(cm, preview) {
    computePosition(cm, preview);

    var scrollInfo = cm.getScrollInfo();
    let scrollElemIdx = null;
    for (let i = 0; i < _cmElemList.length; i++) {
        if (scrollInfo.top < _cmElemList[i]) {
            scrollElemIdx = i - 1;
            break;
        }
    }
    if (scrollElemIdx >= 0) {
        let ratio =
            (scrollInfo.top - _cmElemList[scrollElemIdx]) /
            (_cmElemList[scrollElemIdx + 1] -
                _cmElemList[scrollElemIdx]);
        var top =
            ratio *
            (_previewElemList[scrollElemIdx + 1] -
                _previewElemList[scrollElemIdx]) +
            _previewElemList[scrollElemIdx];
        preview.scrollTo({ top: top });//, behavior: 'smooth' });
    }

    if (scrollInfo.top >= scrollInfo.height - scrollInfo.clientHeight) {
        top = preview.scrollHeight - preview.clientHeight;
        preview.scrollTo({ top: top });//, behavior: 'smooth' });
        return;
    }
}
function onPreviewScroll(cm, preview) {
    computePosition(cm, preview);
    let scrollTop = preview.scrollTop;
    let scrollElemIdx = null;
    for (let i = 0; i < _previewElemList.length; i++) {
        if (scrollTop < _previewElemList[i]) {
            scrollElemIdx = i - 1;
            break;
        }
    }
    // 已经滚动到底部
    if (
        scrollTop >= preview.scrollHeight - preview.clientHeight
    ) {
        let editorScrollInfo = cm.getScrollInfo();
        cm.scrollTo(0, editorScrollInfo.height - editorScrollInfo.clientHeight);
        return;
    }
    if (scrollElemIdx >= 0) {
        let ratio =
            (scrollTop - _previewElemList[scrollElemIdx]) /
            (_previewElemList[scrollElemIdx + 1] -
                _previewElemList[scrollElemIdx]);
        let editorScrollTop =
            ratio *
            (_cmElemList[scrollElemIdx + 1] -
                _cmElemList[scrollElemIdx]) +
            _cmElemList[scrollElemIdx];
        cm.scrollTo(0, editorScrollTop);
    }


    // var top = preview.scrollTop;
    // let scrollInfo = cm.getScrollInfo();
    // if (top >= preview.scrollHeight - preview.clientHeight) {
    //     cm.scrollTo(0, scrollInfo.height - scrollInfo.clientHeight);
    //     return;
    // }
    // var p = top / preview.scrollHeight;
    // top = Math.floor(p * preview.scrollHeight);
    // cm.scrollTo(0, top);
}
export function initScrollListener(cm, preview) {
    document.querySelector(".CodeMirror").addEventListener("mouseenter", function () {
        isScrollCM = true;
    })
    preview.addEventListener("mouseenter", function () {
        isScrollCM = false;
    })

    cm.on("scroll", function (cm) {
        if (!isScrollCM) return;
        onEditScroll(cm, preview)

    })
    preview.addEventListener("scroll", function () {
        if (isScrollCM) return;
        onPreviewScroll(cm, preview)

    });
}
export function onEditingScroll(cm, preview) {//编辑期间刷新
    onEditScroll(cm, preview)
}