# 给 AI 的转录提示词 · TikZ Studio Web 0.1

将下文与原有 TikZ / tikz-cd 代码、必要宏定义和参考图片一起交给 AI。请它返回 `.json` 工程，再在软件“文件 → 打开”中导入。不要只让它“整理为标准 TikZ”，因为任意 TikZ 无法可靠反向恢复编辑结构。

---

你需要把我提供的数学图或 TikZ / tikz-cd 转写为 TikZ Studio 的 version=4 JSON 工程，供纯前端 SVG 编辑器直接导入、拖动编辑。不要调用额外编译后端，不要在 JSON 内嵌 HTML、SVG、任意可执行命令或未识别的 `external_tikz` 源码。

请先阅读原图：确认每个对象的位置、箭头起终点、实虚线、弯曲、单射弯钩、满射双细箭头、标签、填充和层级；不要遗漏。不能确定的地方写在 JSON 外的说明中，不能默默猜测。复杂宏需要我提供定义；无法表示的库特效请说明缺失或采用哪个近似。

输出：一个可保存为 UTF-8 `.json` 的合法 JSON 代码块，之后用短列表说明转换损失。JSON 不允许注释、尾逗号、NaN、Infinity；数学内容中的反斜杠必须按 JSON 规则转义。对象编号用字母开头，只用英文字母、数字、下划线，不能重复。

根结构：

```json
{
  "version": 4,
  "width": 12,
  "height": 8,
  "background": "none",
  "objects": [],
  "groups": [],
  "presets": {},
  "preamble": "\\usepackage{tikz,amsmath,amssymb}\n\\usepackage[UTF8,fontset=fandol]{ctex}\n\\usetikzlibrary{patterns}"
}
```

长度和坐标单位均为 cm，原点在画布左下，x 向右、y 向上。所有坐标有限且绝对值小于 200，画布宽高在 0.5–100 之间，每工程不超过 500 个对象。画布留适当边距。`objects` 顺序从底层到顶层。

对象字段和规则如下，未提到的字段可省略采用默认值：

- 共有：`id`, `kind`, `points`, `text`, `style`, `group`（默认空串），`rotation`（逆时针角度），`rotate_text`（默认 true），`occlude`（默认 true，下层交点留空）。文字内容只有 node / text / arrow 使用。
- `kind="node"`：文字 / 数学节点，`points=[[x,y]]`, `text` 为普通文字或含 `$…$` 的混合文字。不要自动把中文、英文强制放进数学模式。例：`"text":"集合 $A$"` 或 `"text":"$\\alpha$"`。
- `kind="text"`：独立文字，与 node 同坐标方式。
- `kind="point"`：黑点，`points=[[x,y]]`, `width=height=0.075`；颜色由 stroke 指定，通常不带文字。需要点旁文字可用另一个 text。
- `kind="arrow"`：交换图专用连线，`points=[]`；`source` / `target` 是已有 node / point / text 的编号。不要把端点坐标直接放进 points。`offset` 为沿源到目标方向左侧法向的带符号平行偏移（cm），`bend` 为三次曲线控制点的法向位移（cm）。同一节点不支持自环，视觉自环转成 curve 并说明不能跟随单节点自动伸缩。
- 交换图 arrow 可有 `text`, `label_position`（沿实际线长 0–1，默认 0.5），`label_offset`（左法向距离，默认 0.15 cm），`rotation`（标签角度），`label_mask`（`none` 直接覆盖、`cut` 剪掉线段、`fill` 填色遮盖）。多个箭头自动分离时第一条 offset=0，后续 0.25、-0.25、0.5、-0.5。方向相反时 offset 的符号需换算到各自的源→目标法向。
- `kind="line"`：一般线段 / 折线，`points` 至少两个；可在 style.end 设 open 作普通细箭头。没有交换图的标签 / offset 功能，不要加 text。
- `kind="curve"`：分段三次 Bézier，`points=[P0,P1,…]`。`controls=[ [C01,C02], [C11,C12], … ]`。第 i 段从 Pi 经两个控制点到 P(i+1)。`closed=false` 时控制对数=锚点数−1，`closed=true` 时=锚点数，最后一对连回 P0，points 不重复第一个锚点。`smooth=[1,2]` 表示编号1、2锚点的两侧控制柄共线，其余为独立尖点。没有 text。
- `kind="polygon"`：`points` 至少3个，不重复首点，`closed=true`。
- `kind="rect"` / `"ellipse"`：`points=[[中心x,中心y]]`，`width` / `height` 是形状宽高，`rotation` 是整体旋转角度。

style 可省略默认项：

```json
{
  "stroke": "#000000", "fill": "none", "width": 0.018,
  "opacity": 1, "line": "solid", "start": "none",
  "end": "none", "middle": "none", "semantic": "custom",
  "locked": false, "fill_mode": "solid", "fill2": "#ffffff",
  "pattern": "diagonal"
}
```

颜色只能为 `#RRGGBB` 或 `none`；线宽 >0，透明度 0–1。线型只可选 `solid`, `dashed`, `dotted`, `double`, `double-dashed`, `double-dotted`, `wave`, `double-wave`。

始末及中间标记只可选：`none`, `open`（细 / 空心箭头）, `arrow`（实心箭头）, `double-arrow`（前后两个细箭头头部，满射）, `hook`, `hook-reversed`, `bar`, `double-bar`, `circle`, `dot`, `cross`。默认普通交换图箭头应显式设 `end="open"`。

单射：`semantic="mono", locked=true, start="hook", end="open"`。
满射：`semantic="epi", locked=true, start="none", end="double-arrow"`。
同构：`semantic="iso", locked=true, start="none", end="open"`，通常标签为 `$\\cong$`。
自由样式：`semantic="custom", locked=false`。
虚线（存在性等）通过 line=dashed 指定，形式反向 / 取对偶不改变线型，不要推断或验证数学命题。

仅闭合曲线 / 多边形 / 矩形 / 椭圆有填充：fill 是颜色，`fill_mode="solid" | "gradient" | "pattern"`，gradient 的另一颜色 fill2，pattern 可选 `diagonal`, `cross`, `dots`, `grid`。透明背景用根 background=none，留空交点不要用白色线段伪装。

分组可选：`groups=[{"id":"g1","kind":"group","pivot":[6,4],"parent":""}]`，对象 `group="g1"`；不做嵌套。无分组时根 groups=[]。

最小完整例子：

```json
{
  "version": 4, "width": 10, "height": 7, "background": "none",
  "objects": [
    {"id":"A","kind":"node","points":[[2,5]],"text":"$A$"},
    {"id":"B","kind":"node","points":[[7,5]],"text":"$B$"},
    {"id":"f","kind":"arrow","points":[],"source":"A","target":"B",
     "text":"$f$","label_offset":0.18,"style":{"end":"open"}},
    {"id":"L","kind":"curve","points":[[2,2],[5,2]],
     "controls":[[[3,3],[4,1]]],"closed":false,
     "style":{"stroke":"#996633","width":0.025,"end":"open"}}
  ],
  "groups":[], "presets":{}
}
```

请转换以下原始代码 / 图片。不要只复制上述例子；根据我的原图生成真实几何。完成后检查编号唯一、引用端点存在、曲线控制对数量正确、公式反斜杠和普通文字正确转义。

【在这里粘贴原始代码、宏定义或附上图片】
