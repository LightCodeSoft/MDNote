
function renderHighlight(text, lang) {
    if (lang) {
        text = hljs.highlight(text, { language: lang }).value
    } else {
        let obj = hljs.highlightAuto(text);
        text = obj.value;
        lang = obj.language;
    }
    var pre = `<pre><code class="language-${lang} hljs" data-highlighted="yes">`
    return pre + text + "</code></pre>"
}
 

export default function renderCode(text, lang) {
    if (lang == "flow") { 
        return `<div class="flowchart" flow-data="${text}"></div>`
    }
    else if (lang == "seq") { 
        return `<div class="sequence-diagram" seq-data="${text}"></div>`
    }
    // return renderHighlight(text, lang)
    if (lang)
        return `<pre><code class="language-${lang}">${text}</code></pre>`
    else
        return `<pre><code  >${text}</code></pre>`
}