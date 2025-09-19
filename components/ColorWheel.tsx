import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import type { Color } from '../types';

interface ColorWheelProps {
  onColorSelect: (color: Color) => void;
  selectedColor: Color | null;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${x},${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

const findClosestHue = (targetHue: number) => {
    let closestColor = COLORS[0];
    let minDiff = 360;
    for (const color of COLORS) {
        const diff = Math.min(Math.abs(color.hue - targetHue), 360 - Math.abs(color.hue - targetHue));
        if (diff < minDiff) {
            minDiff = diff;
            closestColor = color;
        }
    }
    return closestColor.hue;
};

const ColorWheel: React.FC<ColorWheelProps> = ({ onColorSelect, selectedColor }) => {
  const [hoveredColor, setHoveredColor] = useState<Color | null>(null);
  const [splash, setSplash] = useState<{ key: number; color: string } | null>(null);

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 10;
  const sliceAngle = 360 / COLORS.length;

  const handleColorClick = (color: Color) => {
    onColorSelect(color);
    setSplash({ key: Date.now(), color: color.hex });
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Haptic feedback for selection
    }
  };

  const harmonyHues = useMemo(() => {
    if (!selectedColor) return new Set();
    
    const baseHue = selectedColor.hue;
    const harmonyHuesSet = new Set<number>();
    // Complementary
    harmonyHuesSet.add((baseHue + 180) % 360);
    // Analogous
    harmonyHuesSet.add((baseHue + 360 - 30) % 360);
    harmonyHuesSet.add((baseHue + 30) % 360);
    // Triadic
    harmonyHuesSet.add((baseHue + 120) % 360);
    harmonyHuesSet.add((baseHue + 240) % 360);
    
    return new Set(Array.from(harmonyHuesSet).map(h => findClosestHue(h)));
  }, [selectedColor]);

  const activeColor = hoveredColor || selectedColor;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[300px] sm:max-w-[350px] aspect-square">
        <style>{`
            @keyframes paint-splash {
              from {
                transform: scale(0.2);
                opacity: 1;
              }
              to {
                transform: scale(2.5);
                opacity: 0;
              }
            }
            .animate-paint-splash {
              transform-origin: center;
              animation: paint-splash 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            @keyframes text-fade-in {
              from {
                opacity: 0;
                transform: translateY(5px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-text-fade-in {
                animation: text-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
        `}</style>
        <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
            <g transform={`translate(0, 0)`}>
                {COLORS.map((color, index) => {
                    const startAngle = index * sliceAngle;
                    const endAngle = (index + 1) * sliceAngle;
                    const isSelected = selectedColor?.hex === color.hex;
                    const isHovered = hoveredColor?.hex === color.hex;
                    const isHarmony = !isSelected && harmonyHues.has(color.hue);
                    const isDimmed = selectedColor && !isSelected && !isHarmony;

                    return (
                        <path
                            key={color.hex}
                            d={describeArc(center, center, radius, startAngle, endAngle)}
                            fill={color.hex}
                            onClick={() => handleColorClick(color)}
                            onMouseEnter={() => setHoveredColor(color)}
                            onMouseLeave={() => setHoveredColor(null)}
                            className={`cursor-pointer ${
                                isSelected
                                    ? 'stroke-gray-900 dark:stroke-gray-50'
                                    : isHarmony
                                    ? 'stroke-purple-500'
                                    : 'stroke-white dark:stroke-slate-800'
                            }`}
                            style={{
                                transformOrigin: '150px 150px',
                                transform: isSelected ? 'scale(1.18)' : isHovered ? 'scale(1.08)' : 'scale(1)',
                                strokeWidth: isSelected ? 8 : isHarmony ? 3 : 2,
                                opacity: isDimmed ? 0.4 : 1,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    );
                })}
            </g>
             {splash && (
              <g
                key={splash.key}
                transform={`translate(${center}, ${center})`}
                className="pointer-events-none animate-paint-splash"
              >
                <path
                  fill={splash.color}
                  d="M-3.1,-38.5C-1.1,-48.5,9.6,-53.4,20.1,-51.2C30.6,-49,41,-39.6,44.9,-28.9C48.8,-18.2,46.2,-6.2,42.5,4.3C38.8,14.7,34.1,23.6,26.9,31.2C19.7,38.8,10.1,45.2,-0.9,46.5C-11.9,47.8,-24.4,44,-33.5,36.5C-42.6,29,-48.4,17.8,-50,-0.1C-51.6,-18,-49,-39.1,-39,-46.8C-29,-54.5,-11.6,-48.8,-3.1,-38.5Z"
                  transform="scale(1.1)"
                />
              </g>
            )}
            <g 
                style={{
                    transformOrigin: '150px 150px',
                    transform: selectedColor ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                <circle
                    cx={center}
                    cy={center}
                    r={radius / 2.2}
                    fill={activeColor ? activeColor.hex : 'white'}
                    className={`stroke-gray-200 dark:stroke-slate-700 transition-colors duration-300 ${!activeColor && 'fill-white dark:fill-slate-800'}`}
                    strokeWidth="4"
                />
                 <g key={activeColor ? activeColor.hex : 'empty'} className="animate-text-fade-in">
                    <text
                        x={center}
                        y={center - 5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-semibold pointer-events-none"
                        style={{ mixBlendMode: 'difference', fill: '#ffffff' }}
                      >
                        {activeColor ? activeColor.name : 'Color'}
                      </text>
                      <text
                        x={center}
                        y={center + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs tracking-wider pointer-events-none"
                        style={{ mixBlendMode: 'difference', fill: '#ffffff' }}
                      >
                        {activeColor ? activeColor.hex : 'Selecciona'}
                      </text>
                 </g>
            </g>
        </svg>
    </div>
  );
};

export default ColorWheel;