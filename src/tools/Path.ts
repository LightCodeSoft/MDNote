export default class Path {
    static join(...paths) {
        // let arr = []
        // let isFirst = true
        // for (let p of paths) {
        //     arr.push(p)
        //     isFirst = false;
        // }
        let p = paths.join("/");
        p = Path.standarPath(p)
        return p
    }

    static standarPath(p) {
        p = p.replaceAll(/(\\+)|(\/+)/g, "\\");
        if (p.endsWith("/"))
            p = p.substring(0, p.length - 1)
        if (p[0] == '\\')
            p = p.substring(1)
        return p;
    }
    static getName(p, incExt = true) {
        p = Path.standarPath(p);
        let arr = p.split("\\")
        var name = arr[arr.length - 1];
        if (!incExt) {
            let idx = name.lastIndexOf(".");
            if (idx > 0) {
                name = name.substring(0, idx);
            }
        }
        return name
    }
    static isValidPath(p) {
        var reg = /([a-zA-Z]:[\\\/])?(.+[\\\/]*)*/
        var match = p.match(reg)
        return match[0].length === p.length
    }
    static getParent(p) {
        p = Path.standarPath(p);
        let idx = p.lastIndexOf("\\");
        if (idx > 0) {
            p = p.substring(0, idx)
        }
        return p;
    }
}