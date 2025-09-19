import React, { useState, useEffect, useCallback } from 'react';
import type { Color, MixingStep } from '../types';
import { getMixingInstructions } from '../services/geminiService';

interface ColorMixerProps {
  selectedColor: Color;
}

const ColorInfo: React.FC<{ label: string, color: string }> = ({ label, color }) => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-md mb-2 transition-colors duration-300" style={{ backgroundColor: color }}></div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{color.startsWith('hsl') ? 'Harmonía' : color}</span>
    </div>
);

const RecipeSkeleton = () => (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap items-start gap-6">
            <div className="flex-grow space-y-4 min-w-[150px]">
                {/* Recipe Item 1 */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/5"></div>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                    </div>
                </div>
                {/* Recipe Item 2 */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/6"></div>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                    </div>
                </div>
                {/* Recipe Item 3 */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/5"></div>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                    </div>
                </div>
            </div>
            {/* Result placeholder */}
            <div className="flex-shrink-0 mx-auto">
                <div className="mt-2">
                    <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-20 mb-2 mx-auto"></div>
                    <div className="w-[80px] h-[80px] bg-gray-300 dark:bg-slate-600 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


const ColorMixer: React.FC<ColorMixerProps> = ({ selectedColor }) => {
    const [mixingInstructions, setMixingInstructions] = useState<MixingStep[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Generar Receta Visual');

    const loadingMessages = [
        'Consultando al maestro colorista...',
        'Mezclando pigmentos virtuales...',
        'Calculando proporciones perfectas...',
        'Despertando a la musa del color...',
        'Afinando la paleta de colores...',
        'Generando un momento de inspiración...'
    ];

    useEffect(() => {
        // FIX: In a browser environment, setInterval returns a number, not NodeJS.Timeout.
        let intervalId: number | undefined;
        if (isLoading) {
            let messageIndex = 0;
            setLoadingMessage(loadingMessages[messageIndex]);
            intervalId = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 2200);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isLoading]);


    const getHarmonies = (hue: number) => {
        const toHsl = (h: number) => `hsl(${(h % 360)}, 100%, 50%)`;
        return {
            complementary: toHsl(hue + 180),
            analogous1: toHsl(hue - 30),
            analogous2: toHsl(hue + 30),
            triadic1: toHsl(hue + 120),
            triadic2: toHsl(hue + 240),
        };
    };

    const harmonies = getHarmonies(selectedColor.hue);

    const handleGenerateInstructions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setMixingInstructions(null);
        try {
            const instructionsJson = await getMixingInstructions(selectedColor.hex);
            const instructions = JSON.parse(instructionsJson);
            setMixingInstructions(instructions);
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([100, 30, 100]); // Haptic feedback for success
            }
        } catch (err) {
            console.error(err);
            if (err instanceof SyntaxError) {
                setError("Error al procesar la respuesta del servidor. El formato no es válido.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error desconocido.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedColor]);
    
    useEffect(() => {
      setMixingInstructions(null);
      setError(null);
    }, [selectedColor]);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-6 transition-colors duration-300">
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-slow { animation: fadeIn 0.5s ease-out forwards; }
                @keyframes gentle-paint {
                  0% { transform-origin: bottom right; transform: rotate(-8deg); }
                  50% { transform-origin: bottom right; transform: rotate(12deg) translateY(-2px); }
                  100% { transform-origin: bottom right; transform: rotate(-8deg); }
                }
            `}</style>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Color Seleccionado</h2>
                <div className="flex items-center gap-4 mt-3">
                    <div className="w-16 h-16 rounded-xl border-4 border-white dark:border-slate-800 shadow transition-colors duration-300" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div>
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-200">{selectedColor.name}</p>
                        <p className="text-md text-gray-500 dark:text-gray-400 font-mono">{selectedColor.hex}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Armonías de Color</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <ColorInfo label="Complementario" color={harmonies.complementary} />
                     <ColorInfo label="Análogo 1" color={harmonies.analogous1} />
                     <ColorInfo label="Análogo 2" color={harmonies.analogous2} />
                     <ColorInfo label="Triádico" color={harmonies.triadic1} />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Guía de Mezcla Visual</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Genera una receta visual para obtener el color <span className="font-bold">{selectedColor.name}</span> a partir de colores primarios.
                </p>

                <button
                    onClick={handleGenerateInstructions}
                    disabled={isLoading}
                    className="w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                           <svg
                              style={{ animation: 'gentle-paint 1.5s ease-in-out infinite' }}
                              className="-ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                            {loadingMessage}
                        </>
                    ) : (
                        'Generar Receta Visual'
                    )}
                </button>

                {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 p-3 rounded-lg">{error}</p>}
                
                {isLoading && (
                    <div className="animate-fade-in-slow">
                        <RecipeSkeleton />
                    </div>
                )}

                {!isLoading && mixingInstructions && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg animate-fade-in-slow">
                       <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-100">Receta para {selectedColor.name}:</h4>
                       <div className="flex flex-wrap items-start gap-6">
                          <div className="flex-grow space-y-3 min-w-[150px]">
                            {mixingInstructions.map((step, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-center mb-1">
                                   <div className="flex items-center gap-2">
                                       <div 
                                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-slate-600"
                                          style={{ backgroundColor: step.colorHex }}
                                          aria-hidden="true"
                                       ></div>
                                       <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{step.colorName}</span>
                                   </div>
                                   <span className="text-xs text-gray-500 dark:text-gray-400">{step.parts} parte(s)</span>
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {Array.from({ length: step.parts }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-md border-2 border-white/50 dark:border-black/20 shadow-inner"
                                            style={{ backgroundColor: step.colorHex }}
                                            title={`${step.parts} parte(s) de ${step.colorName}`}
                                        />
                                    ))}
                                </div>
                              </div>
                            ))}
                           </div>
                           <div className="flex-shrink-0 mx-auto">
                                <div className="mt-2">
                                    <h5 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200 text-center">Resultado Aprox.</h5>
                                    <div 
                                        style={{ backgroundColor: selectedColor.hex }}
                                        className="w-[80px] h-[80px] rounded-lg shadow-md border-2 border-white dark:border-slate-600 transition-colors duration-300"
                                        aria-label="Muestra del color resultante aproximado de la mezcla."
                                    ></div>
                                </div>
                           </div>
                       </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorMixer;