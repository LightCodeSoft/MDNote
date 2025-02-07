import { CodeMirror } from "./edit/main.js"
import initMDMode from "./utilbox/md_mode.js"
import { marked } from "./utilbox/marked.esm.js"
import MDDemoText from "./utilbox/constant.js"
import TurndownService from "./turndown/turndown.js"
import { initScrollListener, onEditingScroll } from "./utilbox/scroll.js"
import renderCode from "./utilbox/coderender.js"

var _cm = null;
var _previewDom = null;
var _iframeWin = null;

var renderer = new marked.Renderer();
renderer.code = function (code) {

  return renderCode(code.text, code.lang);
};

function md2html(md) {
  // let html = _m2h.makeHtml(md);
  let html = marked(md, { renderer: renderer })
  return html
}

function onMDChange(cm, obj) {
  let text = cm.getValue()
  // console.log("=====================================", text)
  let html = md2html(text)
  // _previewDom.innerHTML = html;
  _iframeWin.render(html)
  onEditingScroll(cm, _previewDom)
}

function setupCM(root) {
  initMDMode()
  _cm = CodeMirror(root, {
    // lineNumbers: true,
    tabSize: 4,
    lineWrapping: false
  });
  _cm.on("change", onMDChange)
}

export function init(iframe) {
  _iframeWin = iframe.contentWindow
  _previewDom = _iframeWin.document.getElementById("preview");
  setupCM(mdcontent)
  _cm.setValue(MDDemoText)
  initScrollListener(_cm, _previewDom);
}

let HTMLLLL = `
<section id="nice" data-tool="mdnice编辑器" data-website="https://www.mdnice.com"><p>请使用 <strong>Chrome</strong> 浏览器。</p>
<h2><span class="prefix"></span><span class="content">1 通用语法</span><span class="suffix"></span></h2>
<h3><span class="prefix"></span><span class="content">1.1 标题</span><span class="suffix"></span></h3>
<p>在文字写书写不同数量的<code>#</code>可以完成不同的标题，如下：</p>
<h1><span class="prefix"></span><span class="content">一级标题</span><span class="suffix"></span></h1>
<h2><span class="prefix"></span><span class="content">二级标题</span><span class="suffix"></span></h2>
<h3><span class="prefix"></span><span class="content">三级标题</span><span class="suffix"></span></h3>
<h3><span class="prefix"></span><span class="content">1.2 无序列表</span><span class="suffix"></span></h3>
<p>无序列表的使用，在符号<code>-</code>后加空格使用。如下：</p>
<ul>
<li><section>无序列表 1</section></li><li><section>无序列表 2</section></li><li><section>无序列表 3</section></li></ul>
<p>如果要控制列表的层级，则需要在符号<code>-</code>前使用空格。如下：</p>
<ul>
<li><section>无序列表 1</section></li><li><section>无序列表 2
<ul>
<li><section>无序列表 2.1</section></li><li><section>无序列表 2.2</section></li></ul>
</section></li></ul>
<p><strong>由于微信原因，最多支持到二级列表</strong>。</p>
<h3><span class="prefix"></span><span class="content">1.3 有序列表</span><span class="suffix"></span></h3>
<p>有序列表的使用，在数字及符号<code>.</code>后加空格后输入内容，如下：</p>
<ol>
<li><section>有序列表 1</section></li><li><section>有序列表 2</section></li><li><section>有序列表 3</section></li></ol>
<h3><span class="prefix"></span><span class="content">1.4 粗体和斜体</span><span class="suffix"></span></h3>
<p>粗体的使用是在需要加粗的文字前后各加两个<code>*</code>。</p>
<p>而斜体的使用则是在需要斜体的文字前后各加一个<code>*</code>。</p>
<p>如果要使用粗体和斜体，那么就是在需要操作的文字前后加三个<code>*</code>。如下：</p>
<p><strong>这个是粗体</strong></p>
<p><em>这个是斜体</em></p>
<p><strong><em>这个是粗体加斜体</em></strong></p>
<h3><span class="prefix"></span><span class="content">1.5 链接</span><span class="suffix"></span></h3>
<p>微信公众号仅支持公众号文章链接，即域名为<code>https://mp.weixin.qq.com/</code>的合法链接。使用方法如下所示：</p>
<h3><span class="prefix"></span><span class="content">1.6 引用</span><span class="suffix"></span></h3>
<p>引用的格式是在符号 <code>&gt;</code> 后面书写文字，文字的内容可以包含标题、链接、图片、粗体和斜体等。</p>
<p>一级引用如下：</p>
<blockquote class="multiquote-1">
<h3><span class="prefix"></span><span class="content">一级引用示例</span><span class="suffix"></span></h3>
<p>读一本好书，就是在和高尚的人谈话。 <strong>——歌德</strong></p>
<p><a href="https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg">Markdown Nice最全功能介绍</a></p>
</blockquote>
<p>当使用多个 <code>&gt;</code> 符号时，就会变成多级引用</p>
<h3><span class="prefix"></span><span class="content">1.7 分割线</span><span class="suffix"></span></h3>
<p>可以在一行中用三个以上的减号来建立一个分隔线，同时需要在分隔线的上面空一行。如下：</p>
<hr>
<h3><span class="prefix"></span><span class="content">1.8 删除线</span><span class="suffix"></span></h3>
<p>删除线的使用，在需要删除的文字前后各使用两个<code>~</code>，如下：</p>
<p><s>这是要被删除的内容。</s></p>
<h3><span class="prefix"></span><span class="content">1.9 表格</span><span class="suffix"></span></h3>
<p>可以使用冒号来定义表格的对齐方式，如下：</p>
<section class="table-container"><table>
<thead>
<tr>
<th style="text-align:left">姓名</th>
<th style="text-align:center">年龄</th>
<th style="text-align:right">工作</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">小可爱</td>
<td style="text-align:center">18</td>
<td style="text-align:right">吃可爱多</td>
</tr>
<tr>
<td style="text-align:left">小小勇敢</td>
<td style="text-align:center">20</td>
<td style="text-align:right">爬棵勇敢树</td>
</tr>
<tr>
<td style="text-align:left">小小小机智</td>
<td style="text-align:center">22</td>
<td style="text-align:right">看一本机智书</td>
</tr>
</tbody>
</table>
</section><p>宽度过长的表格可以滚动，可在自定义主题中调节宽度：</p>
<section class="table-container"><table>
<thead>
<tr>
<th style="text-align:left">姓名</th>
<th style="text-align:center">年龄</th>
<th style="text-align:right">工作</th>
<th style="text-align:center">邮箱</th>
<th style="text-align:center">手机</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">小可爱</td>
<td style="text-align:center">18</td>
<td style="text-align:right">吃可爱多</td>
<td style="text-align:center">lovely@test.com</td>
<td style="text-align:center">18812345678</td>
</tr>
<tr>
<td style="text-align:left">小小勇敢</td>
<td style="text-align:center">20</td>
<td style="text-align:right">爬棵勇敢树</td>
<td style="text-align:center">brave@test.com</td>
<td style="text-align:center">17712345678</td>
</tr>
<tr>
<td style="text-align:left">小小小机智</td>
<td style="text-align:center">22</td>
<td style="text-align:right">看一本机智书</td>
<td style="text-align:center">smart@test.com</td>
<td style="text-align:center">16612345678</td>
</tr>
</tbody>
</table>
</section><h3><span class="prefix"></span><span class="content">1.10 图片</span><span class="suffix"></span></h3>
<p>插入图片，如果是行内图片则无图例，否则有图例，格式如下：</p>
<figure><img src="https://bitpy.cn/imgs/wx_qr.jpg" alt="这里写图片描述"><figcaption>这里写图片描述</figcaption></figure>
<h3><span class="prefix"></span><span class="content">1.11 代码块</span><span class="suffix"></span></h3>
<blockquote class="multiquote-1">
<p>支持平台：微信公众号、知乎。</p>
</blockquote>
<p>如果在一个行内需要引用代码，只要用反引号引起来就好，如下：</p>
<p>Use the <code>printf()</code> function.</p>
<p>在需要高亮的代码块的前一行及后一行使用三个反引号，同时<strong>第一行反引号后面表示代码块所使用的语言</strong>，如下：</p>
<pre class="custom"><code class="hljs"><span class="hljs-comment">//&nbsp;FileName:&nbsp;HelloWorld.java</span><br><span class="hljs-keyword">public</span>&nbsp;<span class="hljs-class"><span class="hljs-keyword">class</span>&nbsp;<span class="hljs-title">HelloWorld</span>&nbsp;</span>{<br>&nbsp;&nbsp;<span class="hljs-comment">//&nbsp;Java&nbsp;入口程序，程序从此入口</span><br>&nbsp;&nbsp;<span class="hljs-function"><span class="hljs-keyword">public</span>&nbsp;<span class="hljs-keyword">static</span>&nbsp;<span class="hljs-keyword">void</span>&nbsp;<span class="hljs-title">main</span><span class="hljs-params">(String[]&nbsp;args)</span>&nbsp;</span>{<br>&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="hljs-string">"Hello,World!"</span>);&nbsp;<span class="hljs-comment">//&nbsp;向控制台打印一条语句</span><br>&nbsp;&nbsp;}<br>}<br></code></pre>
<p>支持以下语言种类：</p>
<pre class="custom"><code class="hljs">bash<br>clojure，cpp，cs，css<br>dart，dockerfile,&nbsp;diff<br>erlang<br>go，gradle，groovy<br>haskell<br>java，javascript，json，julia<br>kotlin<br>lisp，lua<br>makefile，markdown，matlab<br>objectivec<br>perl，php，python<br>r，ruby，rust<br>scala，shell，sql，swift<br>tex，typescript<br>verilog，vhdl<br>xml<br>yaml<br></code></pre>
</section>

`