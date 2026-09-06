import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bike,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  Navigation,
  MapPin,
  Mountain,
  Droplets,
  Building2,
  Train,
} from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { landmarks, ridingRoutes, RidingRoute } from '@/data/nanjingMap';
import { realDistricts, MAP_VIEW_W, MAP_VIEW_H } from '@/data/realDistricts';
import { yangtze, riverLines, lakeAreas } from '@/data/realWater';

const landmarkIcons = {
  mountain: Mountain,
  lake: Droplets,
  river: Droplets,
  scenic: MapPin,
  historic: Building2,
  transport: Train,
  cbd: Building2,
};

// 主城六区用不同色调，远郊区更浅
const districtFills: Record<string, string> = {
  '320102': '#ececec', // 玄武区
  '320104': '#e6e6e6', // 秦淮区
  '320105': '#ececec', // 建邺区
  '320106': '#e6e6e6', // 鼓楼区
  '320113': '#ececec', // 栖霞区
  '320114': '#e6e6e6', // 雨花台区
  '320115': '#ececec', // 江宁区
  '320111': '#f4f4f4', // 浦口区
  '320116': '#f4f4f4', // 六合区
  '320117': '#f4f4f4', // 溧水区
  '320118': '#f4f4f4', // 高淳区
};

// 主城六区（标签在小比例尺下隐藏，避免拥挤；放大后显示）
const mainCityDistricts = new Set(['320102', '320104', '320105', '320106', '320113', '320114']);
// 默认视野：主城区（新街口附近）
const DEFAULT_ZOOM = 2;
const DEFAULT_PAN = { x: 4, y: 200 };
const DETAIL_ZOOM = 1.6; // 超过该缩放级别显示主城标签与地标

const RidingMap = () => {
  const [selectedRoute, setSelectedRoute] = useState<RidingRoute | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pan, setPan] = useState(DEFAULT_PAN);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const riddenCount = ridingRoutes.filter((r) => r.ridden).length;
  const totalLength = ridingRoutes
    .filter((r) => r.ridden)
    .reduce((acc, r) => acc + parseInt(r.length.replace(/\D/g, '')), 0);

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 0.25, 4)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 0.25, 0.5)), []);
  const handleReset = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    setPan(DEFAULT_PAN);
  }, []);

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

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
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
            <div className="card p-0 relative overflow-hidden bg-[#f8f8f8]">
              {/* 高德风格工具栏 */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
                <button
                  onClick={handleZoomIn}
                  className="w-9 h-9 bg-white border border-[#e0e0e0] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors shadow-sm"
                  aria-label="放大"
                >
                  <ZoomIn size={16} className="text-[#333]" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-9 h-9 bg-white border border-[#e0e0e0] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors shadow-sm"
                  aria-label="缩小"
                >
                  <ZoomOut size={16} className="text-[#333]" />
                </button>
                <button
                  onClick={handleReset}
                  className="w-9 h-9 bg-white border border-[#e0e0e0] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors shadow-sm"
                  aria-label="重置"
                >
                  <RotateCcw size={16} className="text-[#333]" />
                </button>
              </div>

              {/* 比例尺 */}
              <div className="absolute bottom-4 right-4 z-20 bg-white border border-[#e0e0e0] px-3 py-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-0.5 bg-[#333]" />
                  <span className="text-xs text-[#666]">2km</span>
                </div>
              </div>

              {/* 图例 */}
              <div className="absolute bottom-4 left-4 z-20 bg-white border border-[#e0e0e0] p-3 shadow-sm">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-[#0a0a0a]" />
                    <span className="text-[#666]">已骑行</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 border-t-2 border-dashed border-[#999]" />
                    <span className="text-[#666]">待骑行</span>
                  </div>
                </div>
              </div>

              {/* 地图容器 */}
              <div
                className="relative w-full aspect-[4/3] overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${MAP_VIEW_W} ${MAP_VIEW_H}`}
                  className="w-full h-full"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                  }}
                >
                  <defs>
                    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d4e5f7" />
                      <stop offset="100%" stopColor="#b8d4f0" />
                    </linearGradient>
                    <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#d4e5f7" />
                      <stop offset="100%" stopColor="#c8ddf5" />
                    </linearGradient>
                  </defs>

                  {/* 背景 */}
                  <rect width={MAP_VIEW_W} height={MAP_VIEW_H} fill="#f8f8f8" />

                  {/* 行政区划（真实边界，全市 11 区） */}
                  {realDistricts.map((district) => (
                    <path
                      key={district.id}
                      d={district.path}
                      fill={districtFills[district.id] || '#eee'}
                      stroke="#c8c8c8"
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* 湖泊水面（OSM 真实轮廓，含湖心岛） */}
                  {lakeAreas.map((lake) => (
                    <path
                      key={lake.id}
                      d={lake.path}
                      fill="url(#lakeGrad)"
                      fillRule="evenodd"
                      stroke="#a8c8e8"
                      strokeWidth="0.6"
                    />
                  ))}

                  {/* 长江（真实中心线，宽带状双层描边模拟江面与岸线） */}
                  {yangtze.paths.map((p, i) => (
                    <path
                      key={`yj-bank-${i}`}
                      d={p}
                      fill="none"
                      stroke="#a8c8e8"
                      strokeWidth={yangtze.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                  {yangtze.paths.map((p, i) => (
                    <path
                      key={`yj-surface-${i}`}
                      d={p}
                      fill="none"
                      stroke="#cfe2f5"
                      strokeWidth={yangtze.width - 3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* 主要河流（秦淮河、滁河、金川河等真实走向） */}
                  {riverLines.map((river) =>
                    river.paths.map((p, i) => (
                      <path
                        key={`${river.id}-${i}`}
                        d={p}
                        fill="none"
                        stroke="#c2d9f2"
                        strokeWidth={river.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))
                  )}

                  {/* 区域标签（远郊区常显，主城六区放大后显示） */}
                  {realDistricts
                    .filter((d) => !mainCityDistricts.has(d.id) || zoom >= DETAIL_ZOOM)
                    .map((district) => (
                      <text
                        key={`label-${district.id}`}
                        x={district.labelX}
                        y={district.labelY}
                        textAnchor="middle"
                        fontSize={(mainCityDistricts.has(district.id) ? 12 : 14) / zoom}
                        fill="#999"
                        fontFamily="'Noto Sans SC', sans-serif"
                        style={{ pointerEvents: 'none' }}
                      >
                        {district.name}
                      </text>
                    ))}

                  {/* 骑行路线 */}
                  {ridingRoutes.map((route) => {
                    const isHovered = hoveredRoute === route.id;
                    const isSelected = selectedRoute?.id === route.id;

                    return (
                      <g key={route.id}>
                        <path
                          d={route.path}
                          fill="none"
                          stroke={route.ridden ? '#0a0a0a' : '#999'}
                          strokeWidth={isHovered || isSelected ? 8 : route.ridden ? 5 : 2.5}
                          opacity={isHovered || isSelected ? 0.12 : route.ridden ? 0.06 : 0.04}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={route.path}
                          fill="none"
                          stroke={route.ridden ? '#0a0a0a' : '#999'}
                          strokeWidth={isHovered || isSelected ? 3 : route.ridden ? 2 : 1.5}
                          opacity={route.ridden ? 1 : 0.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setHoveredRoute(route.id)}
                          onMouseLeave={() => setHoveredRoute(null)}
                          onClick={() => setSelectedRoute(route)}
                          style={{
                            strokeDasharray: route.ridden ? 'none' : '6 3',
                          }}
                        />
                      </g>
                    );
                  })}

                  {/* 地标（放大后显示；尺寸反向缩放，屏幕上保持恒定大小） */}
                  {zoom >= DETAIL_ZOOM && landmarks.map((landmark) => {
                    const Icon = landmarkIcons[landmark.type as keyof typeof landmarkIcons] || MapPin;
                    return (
                      <g key={landmark.id} style={{ pointerEvents: 'none' }}>
                        <circle cx={landmark.x} cy={landmark.y} r={16 / zoom} fill="#fff" stroke="#ddd" strokeWidth={1 / zoom} />
                        <Icon x={landmark.x - 8 / zoom} y={landmark.y - 8 / zoom} size={16 / zoom} color="#666" />
                        <text
                          x={landmark.x}
                          y={landmark.y + 32 / zoom}
                          textAnchor="middle"
                          fontSize={11 / zoom}
                          fill="#666"
                          fontFamily="'Noto Sans SC', sans-serif"
                        >
                          {landmark.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* 路线 hover 标签 */}
                  {ridingRoutes.map((route) => {
                    const isHovered = hoveredRoute === route.id;
                    if (!isHovered) return null;

                    const center = getPathCenter(route.path);

                    return (
                      <g key={`tooltip-${route.id}`} style={{ pointerEvents: 'none' }}>
                        <rect
                          x={center.x - 75 / zoom}
                          y={center.y - 38 / zoom}
                          width={150 / zoom}
                          height={48 / zoom}
                          fill="#0a0a0a"
                          opacity="0.9"
                        />
                        <text
                          x={center.x}
                          y={center.y - 14 / zoom}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={14 / zoom}
                          fontWeight="500"
                          fontFamily="'Noto Sans SC', sans-serif"
                        >
                          {route.name}
                        </text>
                        <text
                          x={center.x}
                          y={center.y + 6 / zoom}
                          textAnchor="middle"
                          fill="#aaa"
                          fontSize={11 / zoom}
                          fontFamily="'Inter', sans-serif"
                        >
                          {route.length} · {route.ridden ? '已骑行' : '待骑行'}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </FadeIn>

          {/* 侧边信息面板 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 统计卡片 */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-text-primary">{riddenCount}</div>
                  <div className="text-xs text-text-muted mt-1">已骑行路线</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-text-primary">{totalLength}km</div>
                  <div className="text-xs text-text-muted mt-1">总里程</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-display-zh text-text-primary">
                    {ridingRoutes.length - riddenCount}
                  </div>
                  <div className="text-xs text-text-muted mt-1">待探索</div>
                </div>
              </div>
            </FadeIn>

            {/* 路线列表 */}
            <FadeIn delay={0.2}>
              <div className="card p-5 max-h-[480px] overflow-y-auto">
                <h3 className="font-display-zh text-lg mb-4 flex items-center gap-2">
                  <Navigation size={18} className="text-text-primary" />
                  路线列表
                </h3>
                <div className="space-y-2">
                  {ridingRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      onMouseEnter={() => setHoveredRoute(route.id)}
                      onMouseLeave={() => setHoveredRoute(null)}
                      className={`w-full text-left p-3 border transition-all duration-300 ${
                        selectedRoute?.id === route.id
                          ? 'border-text-primary bg-text-primary/5'
                          : 'border-border hover:border-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{route.name}</span>
                        {route.ridden ? (
                          <span className="text-xs px-2 py-0.5 bg-text-primary text-text-inverse">
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
                className="card p-5 border-l-4 border-l-text-primary"
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
                    <Bike size={14} />
                    <span>长度：{selectedRoute.length}</span>
                  </div>
                  {selectedRoute.date && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar size={14} />
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
                  <button className="mt-4 w-full py-2 border border-text-primary text-text-primary text-sm hover:bg-text-primary hover:text-text-inverse transition-colors">
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

function getPathCenter(pathData: string) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length / 2);
  return { x: point.x, y: point.y };
}

export default RidingMap;
