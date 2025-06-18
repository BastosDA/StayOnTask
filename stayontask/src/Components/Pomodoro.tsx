import { useState, useEffect, useRef } from 'react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export default function Pomodoro() {
  const [mode, setMode] = useState<TimerMode>('work');

  // Charger les réglages depuis localStorage
  const getInitialSetting = (key: string, defaultValue: number) => {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored) : defaultValue;
  };

  const [workDuration, setWorkDuration] = useState(() => getInitialSetting('workDuration', 25));
  const [shortBreakDuration, setShortBreakDuration] = useState(() => getInitialSetting('shortBreakDuration', 5));
  const [longBreakDuration, setLongBreakDuration] = useState(() => getInitialSetting('longBreakDuration', 15));

  const getDuration = () => {
    switch (mode) {
      case 'work':
        return workDuration * 60;
      case 'shortBreak':
        return shortBreakDuration * 60;
      case 'longBreak':
        return longBreakDuration * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getDuration());
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sauvegarde des réglages à chaque changement
  useEffect(() => {
    localStorage.setItem('workDuration', workDuration.toString());
  }, [workDuration]);

  useEffect(() => {
    localStorage.setItem('shortBreakDuration', shortBreakDuration.toString());
  }, [shortBreakDuration]);

  useEffect(() => {
    localStorage.setItem('longBreakDuration', longBreakDuration.toString());
  }, [longBreakDuration]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDuration());
    }
  }, [mode, workDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((getDuration() - timeLeft) / getDuration()) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-8">
      <h1 className="text-4xl font-bold">Pomodoro Timer</h1>

      {/* Mode Switch */}
      <div className="flex gap-2">
        <button onClick={() => setMode('work')} className={`px-4 py-2 rounded ${mode === 'work' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Travail</button>
        <button onClick={() => setMode('shortBreak')} className={`px-4 py-2 rounded ${mode === 'shortBreak' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Pause Courte</button>
        <button onClick={() => setMode('longBreak')} className={`px-4 py-2 rounded ${mode === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pause Longue</button>
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-300" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - getProgress() / 100)}
            className="text-red-500 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-gray-800">
            {formatTime(timeLeft)}
          </span>
          <span className="text-lg text-gray-600 mt-2">
            {mode === 'work' ? 'Travail' : mode === 'shortBreak' ? 'Pause Courte' : 'Pause Longue'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button onClick={isRunning ? pauseTimer : startTimer} className="px-6 py-2 bg-blue-500 text-white rounded">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="px-6 py-2 bg-gray-300 text-gray-800 rounded">
          Reset
        </button>
      </div>

      {/* Réglages Durée */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex justify-between">
          Durée travail (min) :
          <input
            type="number"
            value={workDuration}
            onChange={(e) => setWorkDuration(parseInt(e.target.value) || 1)}
            className="ml-4 px-2 py-1 border rounded w-24 text-right"
          />
        </label>
        <label className="flex justify-between">
          Pause courte (min) :
          <input
            type="number"
            value={shortBreakDuration}
            onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 1)}
            className="ml-4 px-2 py-1 border rounded w-24 text-right"
          />
        </label>
        <label className="flex justify-between">
          Pause longue (min) :
          <input
            type="number"
            value={longBreakDuration}
            onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 1)}
            className="ml-4 px-2 py-1 border rounded w-24 text-right"
          />
        </label>
      </div>
    </div>
  );
}