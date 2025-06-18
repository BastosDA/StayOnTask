import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon, Cog6ToothIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Fonction pour créer et jouer un son de notification
  const playNotificationSound = () => {
    if (!settings.soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configuration du son
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio non supporté:', error);
    }
  };

  // Initialize timer with current mode duration
  useEffect(() => {
    const duration = mode === 'work' 
      ? settings.workDuration * 60
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
    
    if (!isRunning) {
      setTimeLeft(duration);
    }
  }, [mode, settings, isRunning]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
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

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Jouer le son de notification
    playNotificationSound();
    
    // Show visual notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    if (mode === 'work') {
      // Determine next break type
      const nextBreakType = (completedSessions) % settings.longBreakInterval === (settings.longBreakInterval - 1)
        ? 'longBreak' 
        : 'shortBreak';
      setMode(nextBreakType);
      
      // Auto start breaks if enabled
      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Une session complète = pomodoro + pause
      setCompletedSessions(prev => prev + 1);
      setMode('work');
      
      // Auto start pomodoros if enabled
      if (settings.autoStartPomodoros) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = mode === 'work' 
      ? settings.workDuration * 60
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
    setTimeLeft(duration);
  };

  const resetSessions = () => {
    setCompletedSessions(0);
    setIsRunning(false);
    setMode('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    // Reset timer with new settings
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalDuration = mode === 'work' 
      ? settings.workDuration * 60
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'from-red-500 to-red-600';
      case 'shortBreak': return 'from-green-500 to-green-600';
      case 'longBreak': return 'from-blue-500 to-blue-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'work': return 'Session de Travail';
      case 'shortBreak': return 'Pause Courte';
      case 'longBreak': return 'Pause Longue';
      default: return 'Pomodoro';
    }
  };

  const getNotificationMessage = () => {
    if (mode === 'work') {
      return 'Session de travail terminée ! Temps de pause.';
    } else {
      return 'Pause terminée ! Retour au travail.';
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 z-50 animate-bounce">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {getNotificationMessage()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">
            Pomodoro Timer
          </h1>
          <p className="text-lg text-gray-600">
            Technique de gestion du temps qui consiste à travailler par blocs de 25 minutes, séparés par de courtes pauses
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8">
          {/* Mode Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-2xl p-1 flex">
              <button
                onClick={() => switchMode('work')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  mode === 'work' 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Travail
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  mode === 'shortBreak' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                Pause Courte
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  mode === 'longBreak' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                Pause Longue
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-80 h-80 mx-auto mb-6 relative">
                {/* Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                    className={`text-red-500 transition-all duration-1000 ${
                      mode === 'work' ? 'text-red-500' :
                      mode === 'shortBreak' ? 'text-green-500' :
                      'text-blue-500'
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-xl font-medium bg-gradient-to-r ${getModeColor()} bg-clip-text text-transparent`}>
                    {getModeText()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all transform hover:scale-105 ${
                isRunning 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                  : `bg-gradient-to-r ${getModeColor()} hover:opacity-90`
              }`}
            >
              {isRunning ? (
                <>
                  <PauseIcon className="w-6 h-6" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="w-6 h-6" />
                  Démarrer
                </>
              )}
            </button>
            
            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all transform hover:scale-105"
            >
              <ArrowPathIcon className="w-6 h-6" />
              Reset
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all transform hover:scale-105"
            >
              <Cog6ToothIcon className="w-6 h-6" />
              Paramètres
            </button>
          </div>

          {/* Stats */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 rounded-2xl">
                <span className="text-purple-800 font-semibold">
                  Sessions complétées: {completedSessions}
                </span>
              </div>
              <button
                onClick={resetSessions}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
                title="Réinitialiser les sessions"
              >
                <TrashIcon className="w-4 h-4" />
                Reset Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">PARAMÈTRES</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Timer Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700">MINUTEUR</h4>
                </div>

                <div className="mb-6">
                  <h5 className="text-base font-medium text-gray-700 mb-4">Temps (minutes)</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-2">Pomodoro</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 bg-gray-100 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-2">Pause courte</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={settings.shortBreakDuration}
                        onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 bg-gray-100 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-2">Pause Longue</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 bg-gray-100 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto Start Options */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Pause démarre automatiquement</span>
                    <ToggleSwitch
                      enabled={settings.autoStartBreaks}
                      onToggle={() => setSettings({...settings, autoStartBreaks: !settings.autoStartBreaks})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Pomodoros démarre automatiquement</span>
                    <ToggleSwitch
                      enabled={settings.autoStartPomodoros}
                      onToggle={() => setSettings({...settings, autoStartPomodoros: !settings.autoStartPomodoros})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Sons activés</span>
                    <ToggleSwitch
                      enabled={settings.soundEnabled}
                      onToggle={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                    />
                  </div>
                </div>

                {/* Long Break Interval */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700">Intervalle pour les pauses longues</span>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value) || 2})}
                    className="w-16 px-3 py-2 bg-gray-100 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => updateSettings(settings)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}