# NOVA-1 Web3D 作品集嵌入指南

这份指南说明如何把 NOVA-1 机器人 Web3D 项目作为一个**组件演示区域**，嵌入到已有的个人作品集网站中，而不是做成一个独立新网页。

## 方案概述

采用 **iframe 嵌入**方案：

- `embed.html` 是专门用于嵌入的精简页面，去掉了独立品牌标题，保留了 3D 场景、控制面板、状态栏和交互功能。
- 你的作品集页面只需用 `<iframe src="./embed.html">` 引入即可。
- 支持全屏按钮，用户可以点击后沉浸式体验。

## 文件说明

```
robot-web3d-embed/
├── embed.html                 # 嵌入目标页（iframe 指向这里）
├── portfolio-example.html     # 作品集页面示例，展示嵌入效果
├── EMBED-GUIDE.md             # 本说明
├── src/
│   ├── embed.css              # 嵌入场景覆盖样式
│   ├── style.css              # 原始样式
│   ├── main.js                # 场景主入口
│   ├── robot.js / ui.js / face.js / effects.js
├── public/models/robot.glb    # 机器人模型
├── blender/                   # Blender 源文件与建模脚本
└── screenshots/               # 效果截图
```

## 快速使用步骤

### 1. 部署 Web3D 文件

把整个 `robot-web3d-embed` 文件夹上传到你的作品集网站服务器或静态托管目录下。

> 也可以只上传运行所需的最小文件：
> `index.html` / `embed.html` / `src/` / `public/models/robot.glb` / `package.json` / `vite.config.js`

如果是 Vite 项目，在服务器上执行：

```bash
cd robot-web3d-embed
npm install
npm run build
```

然后把 `dist/` 目录部署到网站的任意子目录，例如 `/case/nova1/`。

### 2. 在作品集页面中嵌入

把下面这段 HTML 复制到你的作品集页面中想要展示的位置：

```html
<!-- Web3D 演示区域 -->
<div style="
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(56,225,255,0.18);
  box-shadow: 0 0 40px rgba(56,225,255,0.08);
  background: #070b12;
">
  <iframe
    src="./robot-web3d-embed/embed.html"
    title="NOVA-1 Web3D 交互演示"
    allow="fullscreen"
    loading="lazy"
    style="width: 100%; height: 100%; border: 0; display: block;"
  ></iframe>
</div>
<p style="margin-top: 12px; font-size: 13px; color: #64748b;">
  可直接在上方操作机器人：行走、姿态、对话、爆炸拆解与透视视图。
</p>
```

根据实际部署路径修改 `src`：

| 部署位置 | iframe src 示例 |
|---------|----------------|
| 与作品集页面同级 | `./robot-web3d-embed/embed.html` |
| 放在 `/case/nova1/` 子目录 | `/case/nova1/embed.html` |
| 单独域名 | `https://nova1-demo.yourdomain.com/embed.html` |

### 3. 样式微调建议

- 外层容器使用 `aspect-ratio: 16 / 9` 保持比例；如需其他比例，可改为 `4 / 3` 或固定高度如 `height: 600px`。
- 圆角、边框、阴影可根据作品集整体风格调整。
- 在移动端建议把容器高度改为 `480px` 或 `70vh`，避免 16:9 在竖屏上过矮。

### 4. 可选：隐藏更多 UI

如果希望演示区域更纯粹，可以在 `src/embed.css` 中继续隐藏元素：

```css
/* 隐藏左侧面板，只保留 3D 自动旋转展示 */
#panel.embed-panel { display: none; }

/* 隐藏底部字幕 */
#hud-bottom { display: none; }

/* 隐藏摇杆 */
#joystick { display: none; }
```

## 给作品集页面开发者的提示

1. **跨域注意**：如果 Web3D 部署在独立域名或 CDN，而作品集在另一域名，需要配置 CORS，否则 `robot.glb` 可能加载失败。建议放在同一域名下。
2. **模型加载**：首次打开会加载约 1-2MB 的 `robot.glb`，建议开启懒加载 `loading="lazy"`。
3. **WebGL 兼容性**：Three.js 需要 WebGL，大部分现代浏览器支持。可在 iframe 外加一层降级提示。
4. **不要直接修改 `index.html`**：那是完整独立页面；嵌入请使用 `embed.html`。

## 示例效果

打开 `portfolio-example.html` 即可看到一个完整的作品集页面示例，其中已包含嵌入的 NOVA-1 Web3D 演示区域。

## 自定义扩展

- 修改 `src/robot.js` 可调整机器人行为、动作、表情。
- 修改 `src/ui.js` 可增减控制面板按钮。
- 修改 `blender/robot_modeling.py` 可在 Blender 中重新生成外观更复杂的机器人模型。
