import React from 'react';

interface OnboardingTutorialProps {
  onClose: () => void;
}

const TutorialStep: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-indigo-500 dark:text-indigo-300">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{children}</p>
        </div>
    </div>
);


const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-700 transform animate-scale-in">
                <header className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">¡Bienvenido a ChromaMix!</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Tu guía de color para artistas.</p>
                </header>

                <div className="space-y-6">
                    <TutorialStep 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
                        title="1. Explora el Círculo Cromático"
                    >
                        Haz clic en cualquier color de la rueda para seleccionarlo y ver sus detalles.
                    </TutorialStep>
                     <TutorialStep 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>}
                        title="2. Descubre Armonías"
                    >
                        Al seleccionar un color, se resaltarán sus armonías (complementarios, análogos, etc.) para inspirar tus paletas.
                    </TutorialStep>
                    <TutorialStep 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
                        title="3. Genera Recetas de Mezcla"
                    >
                        Obtén una guía visual, paso a paso, para crear el color seleccionado usando solo pigmentos primarios.
                    </TutorialStep>
                </div>

                <div className="mt-8 text-center">
                     <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-105"
                        aria-label="Cerrar tutorial y empezar a usar la aplicación"
                    >
                        ¡Empezar a Crear!
                    </button>
                </div>
            </div>
            
            {/* Some simple animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default OnboardingTutorial;
