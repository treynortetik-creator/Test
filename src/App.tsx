import { useState } from 'react';
import { CheckCircle, BarChart3, Trophy, Settings as SettingsIcon } from 'lucide-react';
import { useHabits } from './hooks/useHabits';
import { ThemeToggle } from './components/common/ThemeToggle';
import { DailyCheckIn } from './components/habits/DailyCheckIn';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { Achievements } from './components/dashboard/Achievements';
import { Settings } from './components/dashboard/Settings';
import './App.css';
import './styles/globals.css';

type TabType = 'today' | 'analytics' | 'achievements' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const {
    habits,
    completions,
    achievements,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    skipHabit,
    updateCompletionNotes,
    getHabitStats,
    exportData,
    importData,
  } = useHabits();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Momentum Tracker...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">🚀</div>
              <div className="logo-text">
                <h1>Momentum Tracker</h1>
                <p>Build better habits, one day at a time</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveTab('today')}
            >
              <CheckCircle size={20} />
              <span>Today</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Trophy size={20} />
              <span>Achievements</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === 'today' && (
            <DailyCheckIn
              habits={habits}
              completions={completions}
              onAddHabit={addHabit}
              onUpdateHabit={updateHabit}
              onDeleteHabit={deleteHabit}
              onToggleCompletion={toggleHabitCompletion}
              onSkip={skipHabit}
              onUpdateNotes={updateCompletionNotes}
              getHabitStats={getHabitStats}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              habits={habits}
              completions={completions}
              getHabitStats={getHabitStats}
            />
          )}

          {activeTab === 'achievements' && (
            <Achievements achievements={achievements} />
          )}

          {activeTab === 'settings' && (
            <Settings onExport={exportData} onImport={importData} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Made with ❤️ for building better habits • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
