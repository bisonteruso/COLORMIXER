import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorMixer from './components/ColorMixer';
import OnboardingTutorial from './components/OnboardingTutorial';
import ImageColorPicker from './components/ImageColorPicker';
import ColorLab from './components/ColorLab';
import Palette from './components/Palette';
import Logo from './components/Logo'; // Import the new Logo component
import type { Color } from './types';

const App: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [mode, setMode] = useState<'mixer' | 'lab'>('mixer');
    const [palette, setPalette] = useState<Color[]>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedPalette = localStorage.getItem('chromamix_palette');
            return savedPalette ? JSON.parse(savedPalette) : [];
        }
        return [];
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme === 'dark';
        }
        return true;
    });

    useEffect(() => {
        const tutorialSeen = localStorage.getItem('chromamix_tutorial_seen');
        if (!tutorialSeen) setShowTutorial(true);
    }, []);
    
    useEffect(() => {
        localStorage.setItem('chromamix_palette', JSON.stringify(palette));
    }, [palette]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleCloseTutorial = () => {
        localStorage.setItem('chromamix_tutorial_seen', 'true');
        setShowTutorial(false);
    };
    
    const handleResetSelection = () => setSelectedColor(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target?.result as string);
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };

    const handlePickerColorSelect = (color: Color) => {
        setSelectedColor(color);
        setUploadedImage(null);
    };

    const handleSaveToPalette = (color: Color) => {
      // Avoid adding duplicates
      if (!palette.some(p => p.hex === color.hex)) {
        setPalette(prevPalette => [...prevPalette, color]);
      }
    };

    const handleSelectFromPalette = (color: Color) => {
        setSelectedColor(color);
        setMode('mixer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearPalette = () => {
        setPalette([]);
    };

    return (
        <>
            {showTutorial && <OnboardingTutorial onClose={handleCloseTutorial} />}
            {uploadedImage && (
                <ImageColorPicker
                    imageUrl={uploadedImage}
                    onColorSelect={handlePickerColorSelect}
                    onClose={() => setUploadedImage(null)}
                />
            )}
             <style>{`
                @keyframes fade-in-button {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-button { animation: fade-in-button 0.3s ease-out forwards; }
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-black p-4 sm:p-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="relative text-center mb-8">
                        <div className="absolute top-0 right-0 z-10">
                             <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>
                        </div>
                        <Logo /> {/* Add the Logo component here */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">ChromaMix</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Tu guía de color y mezcla para artistas</p>
                    </header>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 dark:bg-slate-700 p-1 rounded-lg flex gap-1">
                            <button onClick={() => setMode('mixer')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'mixer' ? 'bg-white dark:bg-slate-900 text-indigo-500' : 'text-gray-600 dark:text-gray-300'}`}>Mezclador</button>
                            <button onClick={() => setMode('lab')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'lab' ? 'bg-white dark:bg-slate-900 text-indigo-500' : 'text-gray-600 dark:text-gray-300'}`}>Laboratorio</button>
                        </div>
                    </div>

                    <main>
                      {mode === 'mixer' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-[350px] flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Círculo Cromático</h2>
                                    <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm transform hover:scale-105">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span>Cuentagotas</span>
                                    </label>
                                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </div>
                                <ColorWheel onColorSelect={setSelectedColor} selectedColor={selectedColor} />
                                {selectedColor && (
                                    <button
                                        onClick={handleResetSelection}
                                        className="mt-6 flex items-center gap-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 animate-fade-in-button"
                                        aria-label="Reiniciar selección de color"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5m-1.5-1.5L4 4l16 16" /></svg>
                                        Limpiar Selección
                                    </button>
                                )}
                            </div>
                            <div className="w-full">
                              {selectedColor ? (
                                  <ColorMixer selectedColor={selectedColor} />
                              ) : (
                                  <div className="flex items-center justify-center h-full min-h-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 text-center transition-colors duration-300">
                                      <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-indigo-300 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-4">Selecciona un Color</h3>
                                          <p className="mt-2 text-gray-500 dark:text-gray-400">
                                              Haz clic en cualquier color del círculo cromático o usa el cuentagotas para empezar.
                                          </p>
                                      </div>
                                  </div>
                              )}
                            </div>
                        </div>
                      ) : (
                        <ColorLab onSaveToPalette={handleSaveToPalette} />
                      )}

                       <Palette 
                          palette={palette} 
                          onColorSelect={handleSelectFromPalette} 
                          onClearPalette={handleClearPalette} 
                        />
                    </main>
                </div>
            </div>
        </>
    );
};

export default App;
