import React, { useState, useMemo } from 'react';
import type { Color } from '../types';
import { hexToRgb, rgbToHex, mixRgbColors, RgbColor } from '../utils/colorUtils';

interface ColorLabProps {
  onSaveToPalette: (color: Color) => void;
}

const BASE_COLORS = {
  RED:    { name: 'Rojo', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
  YELLOW: { name: 'Amarillo', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } },
  BLUE:   { name: 'Azul', hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
  WHITE:  { name: 'Blanco', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } },
  BLACK:  { name: 'Negro', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
};

type BaseColorKey = keyof typeof BASE_COLORS;

const ColorSlider: React.FC<{
    colorKey: BaseColorKey;
    value: number;
    onChange: (value: number) => void;
}> = ({ colorKey, value, onChange }) => {
    const colorInfo = BASE_COLORS[colorKey];
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label htmlFor={`${colorKey}-slider`} className="font-semibold text-gray-700 dark:text-gray-200">{colorInfo.name}</label>
                <span className="text-sm font-mono bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded">{value}</span>
            </div>
            <input
                id={`${colorKey}-slider`}
                type="range"
                min="0"
                max="10"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{ accentColor: colorInfo.hex }}
            />
        </div>
    );
};


const ColorLab: React.FC<ColorLabProps> = ({ onSaveToPalette }) => {
    const [parts, setParts] = useState<Record<BaseColorKey, number>>({
        RED: 0,
        YELLOW: 0,
        BLUE: 0,
        WHITE: 0,
        BLACK: 0,
    });
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    const handlePartChange = (colorKey: BaseColorKey, value: number) => {
        setParts(prevParts => ({ ...prevParts, [colorKey]: value }));
    };

    const mixedColorHex = useMemo(() => {
        const colorsToMix = (Object.keys(BASE_COLORS) as BaseColorKey[]).map(key => ({
            rgb: BASE_COLORS[key].rgb,
            parts: parts[key],
        }));
        const mixedRgb = mixRgbColors(colorsToMix);
        return rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
    }, [parts]);
    
    const handleSave = () => {
        const totalParts = Object.values(parts).reduce((sum, p) => sum + p, 0);
        if (totalParts === 0) return; // Don't save default color

        const newColor: Color = {
            name: `Mezcla ${mixedColorHex}`,
            hex: mixedColorHex,
            hue: 0, // Hue is not applicable for custom mixes in this context
        };
        onSaveToPalette(newColor);
        setShowSaveConfirm(true);
        setTimeout(() => setShowSaveConfirm(false), 1500);
    };

    const handleReset = () => {
        setParts({ RED: 0, YELLOW: 0, BLUE: 0, WHITE: 0, BLACK: 0 });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
             <style>{`
                @keyframes saved-feedback {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-saved-feedback { animation: saved-feedback 0.3s ease-out forwards; }
            `}</style>
            {/* Left Side: Color Display */}
            <div className="flex flex-col items-center justify-center gap-6">
                 <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Resultado de la Mezcla</h2>
                <div
                    className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-gray-100 dark:border-slate-700 shadow-xl transition-colors duration-200"
                    style={{ backgroundColor: mixedColorHex }}
                ></div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-200">Color Resultante</p>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">{mixedColorHex}</p>
                </div>
            </div>

            {/* Right Side: Controls */}
            <div className="flex flex-col gap-6">
                 <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Controles de Pigmento</h2>
                <div className="space-y-4">
                    {(Object.keys(BASE_COLORS) as BaseColorKey[]).map(key => (
                        <ColorSlider
                            key={key}
                            colorKey={key}
                            value={parts[key]}
                            onChange={(value) => handlePartChange(key, value)}
                        />
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                        onClick={handleSave}
                        className="w-full flex-1 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                         {showSaveConfirm ? (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-saved-feedback" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ¡Guardado!
                             </>
                         ) : (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v1h2a1 1 0 011 1v3a1 1 0 01-1 1h-2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 0a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></svg>
                                Añadir a la Paleta
                             </>
                         )}
                    </button>
                    <button
                         onClick={handleReset}
                        className="w-full sm:w-auto bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5m-1.5-1.5L4 4l16 16" /></svg>
                        Reiniciar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorLab;
