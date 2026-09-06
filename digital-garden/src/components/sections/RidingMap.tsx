import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bike, MapPin, ZoomIn, ZoomOut, RotateCcw, Calendar, Navigation } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { ridingRoutes, RidingRoute } from '@/data/ridingRoutes';

const RidingMap = () => {
  const [selectedRoute, setSelectedRoute] = useState<RidingRoute | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const riddenCount = ridingRoutes.filter((r) => r.ridden).length;
  const totalLength = ridingRoutes
    .filter((r) => r.ridden)
    .reduce((acc, r) => acc + parseInt(r.length.replace(/\D/g, '')), 0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <section className="py-section px-container relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-sage/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-terracotta/5 blur-3xl" />

      <div className="max-w-container mx-auto relative z-10">
        <SectionTitle en="CYCLING LOG" zh="骑行日志">
          <p className="text-text-secondary">
            用车轮丈量城市。点击路线可以查看骑行记录，也可以手动点亮你骑过的路。
          </p>
        </SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 地图区域 */}
          <FadeIn className="lg:col-span-8">
            <div className="card p-6 relative">
              {/* 地图控制按钮 */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 bg-bg-card border border-border flex items-center justify-center hover:bg-text-primary hover:text-text-inverse transition-colors"
                  aria-label="放大"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 bg-bg-card border border-border flex items-center justify-center hover:bg-text-primary hover:text-text-inverse transition-colors"
                  aria-label="缩小"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  onClick={handleReset}
                  className="w-10 h-10 bg-bg-card border border-border flex items-center justify-center hover:bg-text-primary hover:text-text-inverse transition-colors"
                  aria-label="重置"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              {/* 地图容器 */}
              <div
                className="relative w-full aspect-[4/3] bg-bg-secondary overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <svg
                  ref={svgRef}
                  viewBox="0 0 600 600"
                  className="w-full h-full"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                  }}
                >
                  {/* 城市背景装饰 */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* 城市轮廓装饰 */}
                  <rect x="50" y="50" width="500" height="500" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* 长江 */}
                  <path
                    d="M 0 150 Q 100 130 200 160 T 400 170 T 600 200"
                    fill="none"
                    stroke="var(--border-strong)"
                    strokeWidth="8"
                    opacity="0.3"
                  />

                  {/* 秦淮河 */}
                  <path
                    d="M 200 350 Q 250 330 300 350 T 360 380"
                    fill="none"
                    stroke="var(--border-strong)"
                    strokeWidth="4"
                    opacity="0.3"
                  />

                  {/* 骑行路线 */}
                  {ridingRoutes.map((route) => {
                    const isHovered = hoveredRoute === route.id;
                    const isSelected = selectedRoute?.id === route.id;

                    return (
                      <g key={route.id}>
                        {/* 路线光晕 */}
                        <path
                          d={route.points}
                          fill="none"
                          stroke={route.ridden ? 'var(--accent-terracotta)' : 'var(--border-strong)'}
                          strokeWidth={isHovered || isSelected ? 12 : route.ridden ? 8 : 4}
                          opacity={isHovered || isSelected ? 0.3 : route.ridden ? 0.15 : 0.1}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* 主路线 */}
                        <path
                          d={route.points}
                          fill="none"
                          stroke={route.ridden ? 'var(--accent-terracotta)' : 'var(--border-strong)'}
                          strokeWidth={isHovered || isSelected ? 4 : route.ridden ? 3 : 2}
                          opacity={route.ridden ? 1 : 0.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setHoveredRoute(route.id)}
                          onMouseLeave={() => setHoveredRoute(null)}
                          onClick={() => setSelectedRoute(route)}
                          style={{
                            strokeDasharray: route.ridden ? 'none' : '8 4',
                          }}
                        />
                      </g>
                    );
                  })}

                  {/* 路线标签 */}
                  {ridingRoutes.map((route) => {
                    const isHovered = hoveredRoute === route.id;
                    if (!isHovered) return null;

                    // 计算路径中点
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', route.points);
                    const length = path.getTotalLength();
                    const point = path.getPointAtLength(length / 2);

                    return (
                      <g key={`label-${route.id}`}>
                        <rect
                          x={point.x - 60}
                          y={point.y - 30}
                          width="120"
                          height="40"
                          fill="var(--text-primary)"
                          opacity="0.9"
                          rx="0"
                        />
                        <text
                          x={point.x}
                          y={point.y - 5}
                          textAnchor="middle"
                          fill="var(--text-inverse)"
                          fontSize="12"
                          fontFamily="'Noto Sans SC', sans-serif"
                        >
                          {route.name}
                        </text>
                        <text
                          x={point.x}
                          y={point.y + 10}
                          textAnchor="middle"
                          fill="var(--text-inverse)"
                          fontSize="10"
                          opacity="0.7"
                          fontFamily="'Inter', sans-serif"
                        >
                          {route.length}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* 图例 */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-accent-terracotta" />
                    <span className="text-text-secondary">已骑行</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-border-strong border-dashed border-t" style={{ borderTopWidth: '2px' }} />
                    <span className="text-text-secondary">待骑行</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* 侧边信息面板 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 统计卡片 */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-accent-terracotta">{riddenCount}</div>
                  <div className="text-xs text-text-muted mt-1">已骑行路线</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-accent-terracotta">{totalLength}km</div>
                  <div className="text-xs text-text-muted mt-1">总里程</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-accent-terracotta">{ridingRoutes.length - riddenCount}</div>
                  <div className="text-xs text-text-muted mt-1">待探索</div>
                </div>
              </div>
            </FadeIn>

            {/* 路线列表 */}
            <FadeIn delay={0.2}>
              <div className="card p-6 max-h-[500px] overflow-y-auto">
                <h3 className="font-display-zh text-lg mb-4 flex items-center gap-2">
                  <Navigation size={18} className="text-accent-terracotta" />
                  路线列表
                </h3>
                <div className="space-y-3">
                  {ridingRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      onMouseEnter={() => setHoveredRoute(route.id)}
                      onMouseLeave={() => setHoveredRoute(null)}
                      className={`w-full text-left p-3 border transition-all duration-300 ${
                        selectedRoute?.id === route.id
                          ? 'border-accent-terracotta bg-accent-terracotta/5'
                          : 'border-border hover:border-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{route.name}</span>
                        {route.ridden ? (
                          <span className="text-xs px-2 py-0.5 bg-accent-terracotta/10 text-accent-terracotta">
                            已骑行
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-border text-text-muted">
                            待骑行
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Bike size={12} />
                          {route.length}
                        </span>
                        {route.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {route.date}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 选中路线详情 */}
            {selectedRoute && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card p-6 border-l-4 border-l-accent-terracotta"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display-zh text-xl">{selectedRoute.name}</h3>
                    <p className="font-display-en text-xs text-text-muted mt-1">{selectedRoute.nameEn}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="text-text-muted hover:text-text-primary text-sm"
                  >
                    关闭
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Bike size={14} className="text-accent-terracotta" />
                    <span>长度：{selectedRoute.length}</span>
                  </div>
                  {selectedRoute.date && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar size={14} className="text-accent-terracotta" />
                      <span>骑行日期：{selectedRoute.date}</span>
                    </div>
                  )}
                  {selectedRoute.notes && (
                    <div className="mt-4 p-4 bg-bg-secondary text-text-secondary">
                      <p className="text-sm leading-relaxed">{selectedRoute.notes}</p>
                    </div>
                  )}
                </div>

                {!selectedRoute.ridden && (
                  <button className="mt-4 w-full py-2 border border-accent-terracotta text-accent-terracotta text-sm hover:bg-accent-terracotta hover:text-text-inverse transition-colors">
                    标记为已骑行
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RidingMap;
