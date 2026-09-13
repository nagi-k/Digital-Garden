# 作品集网站源码包 & 集成说明

## 一、源码位置

完整源码位于：

```
/workspace/portfolio
```

## 二、项目结构

```
portfolio/
├── src/
│   ├── components/        # 公共组件
│   │   ├── Carousel.tsx      # 首页轮播图（当前隐藏）
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Reveal.tsx
│   │   ├── SmartImage.tsx
│   │   └── admin/fields.tsx
│   ├── context/
│   │   └── ContentContext.tsx
│   ├── data/
│   │   └── defaultContent.ts   # 网站内容数据
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Works.tsx
│   │   ├── WorkDetail.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Admin.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── cases/             # 4 个独立作品案例网页
│       ├── case-1/
│       ├── case-2/
│       ├── case-3/
│       └── case-4/
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── index.html
└── package.json
```

## 三、技术栈

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- React Router DOM（HashRouter）

## 四、路由说明

当前使用 **HashRouter**，路由格式为：

```
/#/works
/#/works/1
/#/about
/#/contact
/#/admin
```

HashRouter 的好处：直接部署到任何静态托管，不需要服务端 rewrite 配置。

## 五、集成到大网站的方案

推荐把作品集作为大网站的 **/ui/** 子路径：

```
wangying.online/              # 个人主站首页
wangying.online/ui/           # UI 作品集入口
wangying.online/ui/#/works    # 作品列表
wangying.online/ui/#/about    # 关于我
wangying.online/ui/#/contact  # 联系我
wangying.online/ui/cases/case-1/  # 案例一详情页
wangying.online/ui/cases/case-2/  # 案例二详情页
...
```

## 六、集成前需要修改的地方

### 1. vite.config.ts

把 `base: '/'` 改成 `base: '/ui/'`：

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ui/',
  plugins: [react()],
});
```

### 2. 案例页返回首页链接

4 个案例网页（`public/cases/case-*/index.html`）左上角有返回首页按钮，当前指向 `/`。

需要改成指向 `/ui/` 或 `/ui/#/`。

### 3. 作品详情页跳转案例页

检查 `src/pages/WorkDetail.tsx` 和 `src/data/defaultContent.ts` 中是否有硬编码的案例页链接，需要加上 `/ui/` 前缀。

### 4. 大网站导航到作品集

在大网站首页添加入口：

```html
<a href="/ui/">UI 作品集</a>
```

## 七、构建命令（已执行）

```bash
cd /workspace/portfolio
npm install
npm run build
```

构建产物在 `dist/` 目录。**当前已经构建完成**，可以直接使用。

## 八、部署方式

### 方案 A：和主站部署到同一个 CloudBase 环境

把 `dist/` 里的内容放到 CloudBase 静态网站的 `/ui/` 目录下：

```bash
npx tcb hosting deploy dist/ -e ui-design-d5guvqrft29296773
```

> 注意：需要确认 CloudBase 是否支持子目录部署，或者手动上传到 `/ui/` 路径。

### 方案 B：单独部署到子域名

把作品集单独部署到 `ui.wangying.online`：

1. 备案时新增 `ui.wangying.online` 网站
2. 单独一个 CloudBase 环境或同一个环境的根路径
3. `vite.config.ts` 保持 `base: '/'`
4. 在大网站添加链接：`https://ui.wangying.online`

## 九、当前内容数据

所有可配置内容在 `src/data/defaultContent.ts`，包括：

- 首页 Hero 文案
- 精选作品列表
- 关于页信息
- 联系信息
- 轮播图数据（当前隐藏）

## 十、注意事项

1. 当前轮播图组件已隐藏，可在 `src/pages/Home.tsx` 中恢复
2. 管理后台页面 `/admin` 使用本地 JSON 内容，无后端
3. 4 个案例页是独立的 HTML/CSS/JS，和 React 主站分开维护
4. 图片资源建议使用腾讯云 COS 链接，不要放太大文件在仓库里

## 十一、文件清单

核心源码文件：

```
src/App.tsx
src/main.tsx
src/index.css
src/components/*.tsx
src/pages/*.tsx
src/context/ContentContext.tsx
src/data/defaultContent.ts
public/cases/case-1/index.html
public/cases/case-2/index.html
public/cases/case-3/index.html
public/cases/case-4/index.html
vite.config.ts
tailwind.config.js
package.json
index.html
```
