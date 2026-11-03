# 雲隐的数学个人主页 · 淡幽蓝格言轮播版

本版本已整合全部网站文件及你指定的两条格言，无需再修改轮播代码。

## 已完成

- 原黑板数学壁纸，淡幽蓝色蒙层及卡片。
- 头像居中占位，首页五个栏目入口，各自跳转独立页面。
- 中英文切换，浏览器保留语言选择。
- 两条英文格言每隔 10 秒依次切换，约 0.6 秒淡出及淡入。
- 中文模式电影名称为《追梦赤子心》《坚不可摧》；英文模式为《Rudy》《Unbroken》。格言正文两种模式相同。
- 格言链接留空；填入地址后自动成为可点击链接。
- 浏览器标签在后台、鼠标停在格言上或键盘正在选中格言链接时暂停轮播。系统偏好减少动态效果时直接切换文字。
- 每次打开首页从第一条开始。只有一条格言时不启动轮播。

## 第一次上传（已有旧版也可完整替换）

1. 解压 ZIP，打开 yunyin-site 文件夹。
2. 进入 https://github.com/yunyin1021/yunyin1021.github.io ，确认分支为 main。
3. 建议先点击 Code → Download ZIP 备份现有仓库。
4. 点击 Add file → Upload files。
5. 把 yunyin-site 文件夹里面的所有文件，以及整个 assets 文件夹拖进去。不要把外层 yunyin-site 文件夹作为顶层目录上传。
6. 确认根目录直接有 index.html、about.html、research.html、notes.html、bookmarks.html、workshop.html、background.jpg 和 assets 文件夹。
7. 点击 Commit changes 提交。新版会替换同路径的旧文件。
8. Settings → Pages：Source 为 Deploy from a branch，Branch 为 main，目录为 /(root)。已经如此则保持；否则选择后点击 Save。
9. 在仓库 Actions 等待 Pages 部署成功。访问 https://yunyin1021.github.io/ 。
10. 如果看到旧页面，Mac 按 Command+Shift+R 强制刷新，Windows 按 Ctrl+F5。
11. 让页面保持前台且鼠标移出格言，等待约 11 秒检查第二条；再切换 EN 检查电影名称。

## 放入自己的头像

1. 准备正方形头像，建议 400×400 或 800×800 像素，主体居中；网站会裁成圆形。
2. JPG 图片命名为 avatar.jpg，放到解压文件夹的 assets 文件夹内。PNG 则命名为 avatar.png，不要只改扩展名转换格式。
3. 用纯文本编辑器打开 assets/config.js。Mac 可用 VS Code 或文本编辑（须保持纯文本及 .js 扩展名）。
4. 找到 "avatar": ""，改为 "avatar": "assets/avatar.jpg"。PNG 则填 assets/avatar.png。
5. 将图片和修改后的 config.js 一并上传到 GitHub 的 assets 文件夹并提交。
6. 如果暂时没有头像，什么也不改，继续使用蓝色抽象占位图。

## 以后修改格言（当前两条已填好）

只编辑 assets/config.js 的 mottos 数组即可，每一项均包含：
- text.zh / text.en：两种语言下的正文。希望一直显示英文，就两处填相同英文。
- author.zh / author.en：两种语言下的作者或出处。
- url：该条格言的跳转地址，以 https:// 开头；空字符串不生成链接。

mottoIntervalSeconds 当前为 10，改成 15 即每隔 15 秒轮换。最短为 5 秒。
修改文字时保留双引号、逗号、大括号和方括号。使用中文引号「」可避免英文双引号的转义问题。

## 社交链接、讲义与其他内容

所有可编辑内容在 assets/config.js：
- socials：知乎、B 站、GitHub、邮箱。url 为空时仅显示待补充。邮箱填写 mailto:你的地址。
- about：中英文自我介绍。
- interests：研究方向，已保留原主页的四个方向。
- notes：讲义列表。
- bookmarks：收藏列表。
- workshop：自制程序列表。
- showHomeTitle：false 仅显示简短名字，true 显示完整主页名称。

后三个列表当前为空，没有加入虚构条目。添加条目的格式例如：

```js
{
  "title": {"zh": "讲义名称", "en": "Lecture title"},
  "category": {"zh": "课程分类", "en": "Category"},
  "description": {"zh": "说明", "en": "Description"},
  "url": "files/notes.pdf",
  "tex": "files/notes.tex"
}
```

把 PDF / TeX 文件上传至根目录下的 files 文件夹。收藏条目 url 填外部网站地址；工坊 url 可填 tools/项目/index.html 或外部演示地址，可用 source 字段添加源代码链接。无需的字段可以省略。

## 本机预览

直接用浏览器打开 index.html 即可预览。完整验证跨页语言记忆时，建议在解压文件夹运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

访问 http://127.0.0.1:8765/ 。Ctrl+C 停止。

## 说明

当前成果为本地完整交付包，未自动提交或发布 GitHub 仓库。
仓库已确认从 yunyin1021/hiddencloud.github.io 更名为 yunyin1021/yunyin1021.github.io，默认分支 main。
背景来自原对话上传的「新壁纸+.jpg」，未修改原始图像。参考站的居中结构，样式独立实现。
GitHub Pages 官方部署说明：
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
