# Web3D 滚筒洗衣机 — 网页嵌入组件包

这个目录把完整的 Web3D 洗衣机演示打包成一个**可嵌入组件**，可以直接作为你原有网页中的一个区域使用，不需要做成独立的新页面。

## 目录结构

```
embed/
├── demo/                  # 完整的 Web3D 交互演示（可独立运行）
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   ├── lib/               # Three.js 等依赖，已本地化
│   └── model/washer.glb   # 3D 模型
├── embed.js               # 嵌入组件脚本（自动初始化 + 手动初始化 + Web Component）
├── embed.css              # 加载动画与默认容器样式
├── index.html             # 示例父页面：展示如何把组件放进原有网页
└── README.md              # 本说明
```

## 推荐方案 A：自动初始化（最简单）

### 1. 把 embed/ 复制到你的项目里

例如放到你网站的 `assets/washing-machine/` 下：

```
my-website/
├── index.html
└── assets/
    └── washing-machine/       ← 复制 embed/ 到这里
        ├── embed.js
        ├── embed.css
        └── demo/
            ├── index.html
            ├── main.js
            ├── style.css
            ├── lib/
            └── model/
```

### 2. 在父页面中引入 CSS 和 JS

```html
<head>
  <link rel="stylesheet" href="assets/washing-machine/embed.css">
</head>
<body>
  <!-- 你原有网页的其他内容 -->

  <!-- 嵌入区域 -->
  <div
    data-wm-embed="assets/washing-machine/demo/"
    data-wm-ratio="16/9"
    data-wm-min-height="720"
    data-wm-max-height="1200"
    data-wm-border-radius="20px"
  ></div>

  <script src="assets/washing-machine/embed.js"></script>
</body>
```

### 3. 通过静态服务器访问

WebGL 加载 GLB 需要 HTTP 协议，不要直接双击打开 HTML。

```bash
cd my-website
python3 -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080/
```

## 关于尺寸：如何避免控制面板被截断

右侧控制面板按钮较多，需要足够的高度才能完整显示。默认值已调整为：

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `data-wm-ratio` | `16/9` | 容器宽高比 |
| `data-wm-min-height` | `720` | 最小高度（px） |
| `data-wm-max-height` | `1200` | 最大高度（px） |

**建议**：根据父页面宽度设置足够大的 `data-wm-max-height`，让容器能按 16/9 比例放大。例如父区域宽度 1200px 时，16/9 比例下高度可达 675px；宽度 1600px 时，高度可达 900px。如果仍不够，可进一步把 `max-height` 调大，或改用 `4/3` 比例让高度更充裕。

```html
<!-- 如果页面空间很大，想要更高的显示区域 -->
<div
  data-wm-embed="assets/washing-machine/demo/"
  data-wm-ratio="16/9"
  data-wm-min-height="800"
  data-wm-max-height="1600"
  data-wm-border-radius="20px"
></div>
```

## 所有可配置项

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `data-wm-embed` | `demo/` | demo 目录相对父页面的路径 |
| `data-wm-ratio` | `16/9` | 容器宽高比 |
| `data-wm-min-height` | `720` | 最小高度（px） |
| `data-wm-max-height` | `1200` | 最大高度（px） |
| `data-wm-border-radius` | `16px` | 圆角 |
| `data-wm-title` | `Web3D 智能滚筒洗衣机交互演示` | iframe 标题 |
| `data-wm-loading-text` | `正在加载 3D 演示…` | 加载提示文字 |

## 路径调整说明

**最关键的一步**：根据 `demo/` 相对你父页面的实际位置，修改 `data-wm-embed` 的路径。

| 父页面位置 | demo 位置 | 应填路径 |
| --- | --- | --- |
| `/index.html` | `/assets/washing-machine/demo/` | `assets/washing-machine/demo/` |
| `/index.html` | `/washing-machine/demo/` | `washing-machine/demo/` |
| `/cases/index.html` | `/assets/washing-machine/demo/` | `../assets/washing-machine/demo/` |
| `/cases/index.html` | `/washing-machine/demo/` | `../washing-machine/demo/` |

> 路径规则：以父页面所在目录为基准，写相对路径；也可以使用绝对路径（以 `/` 开头）。

## 其他嵌入方式（备选）

如果需要在 React / Vue 或动态渲染场景中使用，可以采用手动初始化：

```html
<div id="wm-demo"></div>
<script src="assets/washing-machine/embed.js"></script>
<script>
  WashingMachineEmbed.init('#wm-demo', {
    src: 'assets/washing-machine/demo/',
    ratio: '16/9',
    minHeight: 720,
    maxHeight: 1200
  });
</script>
```

现代浏览器也支持 Web Component：

```html
<washing-machine-demo src="assets/washing-machine/demo/"></washing-machine-demo>
<script src="assets/washing-machine/embed.js"></script>
```

## 样式定制

容器由 `.wm-embed-wrapper` 包裹，默认有深色背景、圆角、阴影。你可以在你自己的 CSS 中覆盖：

```css
.wm-embed-wrapper {
  border-radius: 24px;
  border: 2px solid #2ec3e5;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
}
```

## 部署方式

把整个 `embed/` 目录随你的网站一起部署到静态托管：

- GitHub Pages / Gitee Pages
- Netlify / Vercel / Cloudflare Pages
- 公司内网服务器 / 对象存储 CDN

只需要保证 `embed/demo/` 里的文件能通过 HTTP 访问即可。

## 常见问题

**Q：右侧控制面板按钮显示不全？**
A：加大 `data-wm-max-height`，或把 `data-wm-ratio` 改为 `4/3`。容器按父页面宽度自适应，宽度越大高度越大。

**Q：页面一片空白或报错？**
A：最常见原因是路径填错，浏览器找不到 `demo/index.html` 或 `demo/model/washer.glb`。打开浏览器开发者工具 → Network 面板检查 404。

**Q：直接双击打开 HTML 不显示？**
A：WebGL 加载 GLB 必须通过 HTTP/HTTPS 协议。请用 `python3 -m http.server` 或任何静态服务器预览。

**Q：组件和父页面风格不搭？**
A：覆盖 `.wm-embed-wrapper` 的样式，或修改 `embed.css`。iframe 内部界面（控制面板）的颜色在 `demo/style.css` 中。

## 给接手 AI 的提示

1. 先确认用户原有网页的目录结构。
2. 把 `embed/` 复制到合适位置（建议 `assets/washing-machine/`）。
3. 根据父页面位置，计算并填入正确的 `demo/` 相对路径。
4. 在父页面引入 `embed.css` 和 `embed.js`。
5. **务必设置足够大的 `data-wm-max-height`**（默认 1200，可继续加大），确保右侧控制面板完整显示。
6. 用 `python3 -m http.server` 本地验证，确认无 404 且 WebGL 正常渲染。
