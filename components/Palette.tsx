import React, { useState } from 'react';
import type { Color } from '../types';

interface PaletteProps {
  palette: Color[];
  onColorSelect: (color: Color) => void;
  onClearPalette: () => void;
}

const Palette: React.FC<PaletteProps> = ({ palette, onColorSelect, onClearPalette }) => {
  const [isSaved, setIsSaved] = useState(false);

  if (palette.length === 0) {
    return null;
  }

  const handleSavePalette = () => {
    localStorage.setItem('chromamix_palette', JSON.stringify(palette));
    setIsSaved(true);
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Mi Paleta</h2>
        <div className="flex items-center gap-4">
            <button
              onClick={handleSavePalette}
              disabled={isSaved}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors disabled:opacity-70 disabled:hover:text-gray-500"
              aria-label="Guardar la paleta actual"
            >
              {isSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  <span>Guardar</span>
                </>
              )}
            </button>
            <button
              onClick={onClearPalette}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Limpiar toda la paleta"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar
            </button>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {palette.map((color) => (
            <div key={color.hex} className="group relative" onClick={() => onColorSelect(color)}>
              <div
                className="w-full aspect-square rounded-lg shadow-inner cursor-pointer border-2 border-transparent group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: color.hex }}
                title={`Seleccionar ${color.name} (${color.hex})`}
              ></div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {color.hex}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Palette;
