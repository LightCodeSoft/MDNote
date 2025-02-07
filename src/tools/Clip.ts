export default class Clip {
    // static copyFile(plain, cb = null) {
    //     if (typeof ClipboardItem !== "undefined") {
    //         const text = new Blob([plain], { type: "text/files" });
    //         const data = new ClipboardItem({ "text/files": text });
    //         navigator.clipboard.write([data]).then(function () {
    //             cb && cb();
    //         });
    //     } else {
    //         const cb = e => {
    //             e.clipboardData.setData("text/files", plain);
    //             e.preventDefault();
    //         };
    //         document.addEventListener("copy", cb);
    //         document.execCommand("copy");
    //         document.removeEventListener("copy", cb);
    //     }
    // }
    static copy(plain, cb = null) {
        if (typeof ClipboardItem !== "undefined") {
            const text = new Blob([plain], { type: "text/plain" });
            const data = new ClipboardItem({ "text/plain": text });
            navigator.clipboard.write([data]).then(function () {
                cb && cb();
            });
        } else {
            // Fallback using the deprecated `document.execCommand`.
            // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
            const _cb = e => {
                e.clipboardData.setData("text/plain", plain);
                e.preventDefault();
            };
            document.addEventListener("copy", _cb);
            document.execCommand("copy");
            document.removeEventListener("copy", _cb);
            cb && cb();
        }
    }
    static copyRich(plain, rich, cb = null) {
        if (typeof ClipboardItem !== "undefined") {
            // Shiny new Clipboard API, not fully supported in Firefox.
            // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
            const html = new Blob([rich], { type: "text/html" });
            const text = new Blob([plain], { type: "text/plain" });
            const data = new ClipboardItem({ "text/html": html, "text/plain": text });
            navigator.clipboard.write([data]).then(function () {
                cb && cb();
            });
        } else {
            // Fallback using the deprecated `document.execCommand`.
            // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
            const _cb = e => {
                e.clipboardData.setData("text/html", rich);
                e.clipboardData.setData("text/plain", plain);
                e.preventDefault();
            };
            document.addEventListener("copy", _cb);
            document.execCommand("copy");
            document.removeEventListener("copy", _cb);
            cb && cb();
        }
    }
    static readText(cb) {
        navigator.clipboard
            .readText()
            .then(
                (clipText) => (cb && cb(clipText)),
            );
    }
    static read(cb) {
        navigator.clipboard
            .read()
            .then(
                (clipText) => (cb && cb(clipText)),
            );

    }

    // static async customTypeCopy(type, plain) {
    //     if (typeof ClipboardItem !== "undefined") {
    //         // Shiny new Clipboard API, not fully supported in Firefox.
    //         // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
    //         const text = new Blob([plain], { type: type });
    //         const data = new ClipboardItem({ type: text });
    //         await navigator.clipboard.write([data]);
    //         console.log("copy")
    //     } else {
    //         // Fallback using the deprecated `document.execCommand`.
    //         // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
    //         const cb = e => {
    //             e.clipboardData.setData(type, plain);
    //             e.preventDefault();
    //         };
    //         document.addEventListener("copy", cb);
    //         document.execCommand("copy");
    //         document.removeEventListener("copy", cb);
    //     }
    // }
}