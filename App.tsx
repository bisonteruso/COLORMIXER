import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorMixer from './components/ColorMixer';
import OnboardingTutorial from './components/OnboardingTutorial';
import type { Color } from './types';

const App: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedTheme = localStorage.getItem('theme');
            // Respect saved theme, otherwise default to dark mode
            if (savedTheme) {
                return savedTheme === 'dark';
            }
        }
        return true; // Default to dark mode
    });

    useEffect(() => {
        const tutorialSeen = localStorage.getItem('chromamix_tutorial_seen');
        if (!tutorialSeen) {
            setShowTutorial(true);
        }
    }, []);

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

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleCloseTutorial = () => {
        localStorage.setItem('chromamix_tutorial_seen', 'true');
        setShowTutorial(false);
    };
    
    const handleResetSelection = () => {
        setSelectedColor(null);
    };

    return (
        <>
            {showTutorial && <OnboardingTutorial onClose={handleCloseTutorial} />}
             <style>{`
                @keyframes fade-in-button {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-button { animation: fade-in-button 0.3s ease-out forwards; }
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-black p-4 sm:p-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="relative text-center mb-8 md:mb-12">
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
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">ChromaMix</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Tu guía de color y mezcla para artistas</p>
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Círculo Cromático</h2>
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
                                          Haz clic en cualquier color del círculo cromático para ver sus armonías y obtener instrucciones de mezcla.
                                      </p>
                                  </div>
                              </div>
                          )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default App;