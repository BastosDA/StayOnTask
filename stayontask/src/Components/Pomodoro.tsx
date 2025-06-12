import { useState, useEffect, useRef } from 'react';

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes en secondes
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de décompte du temps
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Fonction de démarrage
  const startTimer = () => {
    setIsRunning(true);
  };

  // Fonction de pause
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Fonction de réinitialisation
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">
            Pomodoro Timer
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Technique de gestion du temps qui consiste à travailler par blocs de 25 minutes, séparés par de courtes pauses
          </p>
          
          {/* Affichage basique du temps pour tester les fonctions */}
          <div className="text-6xl font-bold text-gray-800 mb-8">
            {formatTime(timeLeft)}
          </div>
          
          {/* Boutons de contrôle basiques */}
          <div className="flex justify-center gap-4">
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              {isRunning ? 'Pause' : 'Démarrer'}
            </button>
            
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}