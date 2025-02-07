let MDDemoText = `
请使用 **Chrome** 浏览器。

$$
  \\begin{pmatrix}
  1 & a_1 & a_1^2 & \\cdots & a_1^n \\\\
  1 & a_2 & a_2^2 & \\cdots & a_2^n \\\\
  \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\
  1 & a_m & a_m^2 & \\cdots & a_m^n \\\\
  \\end{pmatrix}
$$

一般情况下 $a+b$ 的结果fddfasg


## 1 通用语法

### 1.1 标题


\`\`\`flow
st=>start: 用户登陆ffdsf
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
\`\`\`

在文字写书写不同数量的\`#\`可以完成不同的标题，如下：

# 一级标题

\`\`\`seq
Andrew->China: Says Hello
Note right of China: China thinks\\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
\`\`\`

## 二级标题

### 三级标题

### 1.2 无序列表

无序列表的使用，在符号\`-\`后加空格使用。如下：

- 无序列表 1
- 无序列表 2
- 无序列表 3

如果要控制列表的层级，则需要在符号\`-\`前使用空格。如下：

- 无序列表 1
- 无序列表 2
- 无序列表 2.1
- 无序列表 2.2

**由于微信原因，最多支持到二级列表**。

### 1.3 有序列表

有序列表的使用，在数字及符号\`.\`后加空格后输入内容，如下：

1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

### 1.4 粗体和斜体

粗体的使用是在需要加粗的文字前后各加两个\`*\`。

而斜体的使用则是在需要斜体的文字前后各加一个\`*\`。

如果要使用粗体和斜体，那么就是在需要操作的文字前后加三个\`*\`。如下：

**这个是粗体**

_这个是斜体_

**_这个是粗体加斜体_**

### 1.5 链接

微信公众号仅支持公众号文章链接，即域名为\`https://mp.weixin.qq.com/\`的合法链接。使用方法如下所示：


### 1.6 引用

引用的格式是在符号 \`>\` 后面书写文字，文字的内容可以包含标题、链接、图片、粗体和斜体等。

一级引用如下：

> ### 一级引用示例
>
> 读一本好书，就是在和高尚的人谈话。 **——歌德**
>
> [Markdown Nice最全功能介绍]
>

当使用多个 \`>\` 符号时，就会变成多级引用



### 1.7 分割线

可以在一行中用三个以上的减号来建立一个分隔线，同时需要在分隔线的上面空一行。如下：

---

### 1.8 删除线

删除线的使用，在需要删除的文字前后各使用两个\`~\`，如下：

~~这是要被删除的内容。~~

### 1.9 表格

可以使用冒号来定义表格的对齐方式，如下：

| 姓名 | 年龄 | 工作 |
| :--------- | :--: | -----------: |
| 小可爱 | 18 | 吃可爱多 |
| 小小勇敢 | 20 | 爬棵勇敢树 |
| 小小小机智 | 22 | 看一本机智书 |

宽度过长的表格可以滚动，可在自定义主题中调节宽度：

| 姓名 | 年龄 | 工作 | 邮箱 | 手机 |
| :--------- | :--: | -----------: | :-------------: | :---------: |
| 小可爱 | 18 | 吃可爱多 | lovely@test.com | 18812345678 |
| 小小勇敢 | 20 | 爬棵勇敢树 | brave@test.com | 17712345678 |
| 小小小机智 | 22 | 看一本机智书 | smart@test.com | 16612345678 |

### 1.10 图片

插入图片，如果是行内图片则无图例，否则有图例，格式如下：

![这里写图片描述](https://pandao.github.io/editor.md/examples/images/4.jpg)


### 1.11 代码块

> 支持平台：微信公众号、知乎。

如果在一个行内需要引用代码，只要用反引号引起来就好，如下：

Use the \`printf()\` function.

在需要高亮的代码块的前一行及后一行使用三个反引号，同时**第一行反引号后面表示代码块所使用的语言**，如下：

\`\`\`java
// FileName: HelloWorld.java
public class HelloWorld {
  // Java 入口程序，程序从此入口
  public static void main(String[] args) {
    System.out.println("Hello,World!"); // 向控制台打印一条语句
  }
}
\`\`\`

支持以下语言种类：

\`\`\`
bash
clojure，cpp，cs，css
dart，dockerfile, diff
erlang
go，gradle，groovy
haskell
java，javascript，json，julia
kotlin
lisp，lua
makefile，markdown，matlab
objectivec
perl，php，python
r，ruby，rust
scala，shell，sql，swift
tex，typescript
verilog，vhdl
xml
yaml
\`\`\`
`

export default MDDemoText;