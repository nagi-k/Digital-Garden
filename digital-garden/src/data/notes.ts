export interface Note {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  status: 'seedling' | 'growing' | 'mature';
  readTime: number;
}

export const notes: Note[] = [
  {
    id: 1,
    slug: 'figma-auto-layout-deep-dive',
    title: 'Figma 自动布局的深度实践',
    excerpt:
      '从基础约束到组件变体，记录我如何用 Auto Layout 构建灵活且可维护的设计系统。',
    content: `## 为什么自动布局很重要

自动布局不仅仅是让元素对齐的工具，它是一种设计思维的转变——从"摆放"到"构建关系"。

### 我的实践心得

1. **先思考层级，再设置约束**
   - 明确父子关系
   - 理解主轴和交叉轴
   - 用嵌套解决复杂布局

2. **组件变体的组织**
   - 按功能分组
   - 命名规范一致
   - 预留扩展空间

3. **常见问题与解法**
   - 文本截断：设置最小宽度
   - 间距异常：检查嵌套层级
   - 响应式失效：重新审视约束逻辑`,
    date: '2026-08-15',
    updatedAt: '2026-08-20',
    tags: ['Figma', '设计系统', '工作方法'],
    status: 'growing',
    readTime: 8,
  },
  {
    id: 2,
    slug: 'micro-interactions-that-matter',
    title: '有意义的微交互设计原则',
    excerpt:
      '微交互不是装饰，而是对话。记录我如何从用户心理出发设计有目的的动效。',
    content: `## 微交互的价值

好的微交互应该回答用户的问题："我点击成功了吗？""接下来会发生什么？""系统听懂我了吗？"

### 三个设计原则

1. **反馈先于修饰**
   - 状态变化必须被感知
   - 反馈速度与操作复杂度成正比

2. **动效服务于信息**
   - 过渡动画解释元素之间的关系
   - 避免无意义的弹跳和闪烁

3. **性能是底线**
   - 只使用 transform 和 opacity
   - 保持 60fps
   - 移动端做降级处理`,
    date: '2026-07-28',
    tags: ['交互设计', '动效', '用户体验'],
    status: 'mature',
    readTime: 6,
  },
  {
    id: 3,
    slug: 'reading-note-design-of-everyday-things',
    title: '《设计心理学》读书笔记',
    excerpt: '唐纳德·诺曼的经典之作，重新理解"好设计"的标准。',
    content: `## 核心观点

好的设计是"不可见的"——用户不需要思考就知道如何使用。

### 设计原则摘录

- **示能**：物体自身传达它的用途
- **意符**：指示用户如何操作
- **映射**：控制与结果之间的对应关系
- **反馈**：操作后的即时回应

### 我的反思

很多所谓的"创新设计"实际上是在增加用户的认知负担。真正的创新应该是让复杂的事情变简单，而不是让简单的事情看起来更酷。`,
    date: '2026-07-10',
    tags: ['读书笔记', '设计方法', '用户体验'],
    status: 'seedling',
    readTime: 5,
  },
  {
    id: 4,
    slug: 'color-system-for-digital-products',
    title: '数字产品的色彩系统构建',
    excerpt: '从品牌色到功能色，记录一套可扩展的色彩系统搭建过程。',
    content: `## 色彩系统的层次

一个完整的数字产品色彩系统应该包含：

1. **品牌层**：主色、辅助色、品牌渐变
2. **功能层**：成功、警告、错误、信息
3. **中性层**：文字、背景、边框、分割线
4. **语义层**：根据使用场景命名的 token

### 我的经验

- 先定义语义，再分配颜色
- 保持对比度符合 WCAG 2.1 AA 标准
- 深色模式不是简单反色，需要重新设计明度关系`,
    date: '2026-06-22',
    tags: ['设计系统', '色彩', '工作方法'],
    status: 'growing',
    readTime: 10,
  },
];
