import React, { useRef, useEffect, useState } from 'react';
import type { Color } from '../types';
import { COLORS } from '../constants';
import { hexToRgb, rgbToHex, colorDistance } from '../utils/colorUtils';

const findClosestColorInPalette = (targetHex: string): Color => {
  const targetRgb = hexToRgb(targetHex);
  if (!targetRgb) return COLORS[0];

  let closestColor = COLORS[0];
  let minDistance = Infinity;

  for (const paletteColor of COLORS) {
    const paletteRgb = hexToRgb(paletteColor.hex);
    if (paletteRgb) {
      const distance = colorDistance(targetRgb, paletteRgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = paletteColor;
      }
    }
  }
  return closestColor;
};

// --- Component ---
interface ImageColorPickerProps {
  imageUrl: string;
  onColorSelect: (color: Color) => void;
  onClose: () => void;
}

const ImageColorPicker: React.FC<ImageColorPickerProps> = ({ imageUrl, onColorSelect, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const [hoveredColor, setHoveredColor] = useState<string>('#FFFFFF');
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;
    image.onload = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.8;
      let { width, height } = image;
      let ratio = 1;

      if (width > maxWidth) {
        ratio = maxWidth / width;
      }
      if (height * ratio > maxHeight) {
        ratio = maxHeight / height;
      }
      
      width *= ratio;
      height *= ratio;
      
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });
      ctx.drawImage(image, 0, 0, width, height);
    };
  }, [imageUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const loupe = loupeRef.current;
    if (!canvas || !loupe) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setHoveredColor(hex);
    
    loupe.style.transform = `translate(calc(${e.clientX}px - 60px), calc(${e.clientY}px - 60px))`;
    loupe.style.setProperty('--loupe-bg-image', `url(${canvas.toDataURL()})`);
    loupe.style.setProperty('--loupe-bg-pos-x', `${-x * 10 + 54}px`);
    loupe.style.setProperty('--loupe-bg-pos-y', `${-y * 10 + 54}px`);
  };
  
  const handleClick = () => {
    const closestColor = findClosestColorInPalette(hoveredColor);
    onColorSelect(closestColor);
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
        <style>{`
          .loupe {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: fixed;
            pointer-events: none;
            overflow: hidden;
            display: block;
            z-index: 60;
            top: 0; left: 0;
          }
          .loupe-inner {
            width: 100%;
            height: 100%;
            background-image: var(--loupe-bg-image);
            background-repeat: no-repeat;
            background-size: ${canvasSize.width * 10}px ${canvasSize.height * 10}px;
            background-position: var(--loupe-bg-pos-x) var(--loupe-bg-pos-y);
            image-rendering: pixelated;
          }
          .loupe::after {
             content: '';
             position: absolute;
             top: 50%;
             left: 50%;
             width: 12px;
             height: 12px;
             transform: translate(-50%, -50%);
             border: 2px solid white;
             box-shadow: 0 0 5px rgba(0,0,0,0.5);
             mix-blend-mode: difference;
          }
          @keyframes fade-in {
              from { opacity: 0; } to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
        <div 
          ref={loupeRef}
          className="loupe"
        >
          {/* FIX: Cast style object to React.CSSProperties to allow for CSS custom properties. */}
          <div className="loupe-inner" style={{ '--loupe-bg-image': 'none' } as React.CSSProperties}></div>
        </div>
        <div className="relative max-w-full max-h-full">
            <canvas 
              ref={canvasRef} 
              onMouseMove={handleMouseMove} 
              onClick={handleClick}
              className="rounded-lg shadow-2xl cursor-crosshair"
            />
            <button
                onClick={onClose}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full text-gray-700 dark:text-gray-200 shadow-lg flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Cerrar selector de imagen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-lg">
                <div className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: hoveredColor }}></div>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{hoveredColor}</span>
            </div>
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-lg text-center">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Cuentagotas Mágico</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Haz clic en la imagen para seleccionar un color</p>
             </div>
        </div>
    </div>
  );
};

export default ImageColorPicker;
