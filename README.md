# 🚀 Momentum Tracker

A comprehensive web-based habit tracker that helps users build and maintain positive habits through intuitive tracking, detailed analytics, and motivational features.

## ✨ Features

### Core Habit Management
- **Custom Habit Creation**: Create habits with customizable names, descriptions, categories, and colors
- **Frequency Settings**: Support for daily, weekly, and monthly habit tracking
- **Category Organization**: Pre-defined categories (Health, Fitness, Productivity, Learning, Mindfulness, Social, Finance, Custom)
- **Quantity Tracking**: Track specific quantities (e.g., 8 glasses of water, 30 minutes of exercise)

### Daily Check-in Interface
- **One-Click Completion**: Quick and satisfying habit completion with visual feedback
- **Skip Options**: Ability to skip habits on specific days
- **Notes & Reflections**: Add notes to track progress and thoughts
- **Past Day Logging**: Log completions for previous days
- **Progress Bar**: Visual progress indicator showing daily completion percentage

### Advanced Analytics & Visualizations
- **Interactive Heatmap Calendar**: GitHub-style activity calendar showing habit consistency over the year
- **Streak Tracking**: Current and longest streak counters for each habit
- **Habit Strength Score**: Composite score (0-100) based on consistency, completion rate, and streaks
- **Completion Rate Charts**: Daily and weekly trend visualizations
- **Top Performers**: Dashboard showing your most successful habits

### Gamification & Achievements
- **Achievement System**: Unlock badges for milestones
  - 🌱 First Step - Create your first habit
  - 🔥 Week Warrior - Maintain a 7-day streak
  - 💪 Month Master - Maintain a 30-day streak
  - ⭐ Perfect Week - Complete all habits for 7 days
  - 💯 Century Club - Complete 100 habits
  - 📚 Habit Collector - Create 10 habits
- **Progress Tracking**: Visual progress indicators for locked achievements

### Data Management
- **Export Data**: Download all your habits, completions, and achievements as JSON
- **Import Data**: Restore from previous backups
- **Local Storage**: All data stored locally in your browser (no server required)

## 🎨 Design Philosophy

Inspired by successful habit tracking apps like Streaks and Pattrn, Momentum Tracker features:
- Clean, minimalist interface
- Satisfying completion animations using Framer Motion
- Color-coded habits for easy visual identification
- Responsive design that works on all devices
- Smooth transitions and micro-interactions

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: Browser LocalStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage Guide

### Creating Your First Habit

1. Click the "Add Habit" button on the Today page
2. Fill in the habit details:
   - Name (required)
   - Description (optional)
   - Category (required)
   - Frequency (daily/weekly/monthly)
   - Target count (optional, for quantity-based habits)
   - Color (auto-assigned based on category, customizable)
3. Click "Create Habit"

### Daily Check-in

1. Navigate to the "Today" tab
2. Click the green checkmark to complete a habit
3. Click the X icon to skip a habit
4. Click the message icon to add notes
5. Track your progress with the completion percentage bar

### Viewing Analytics

1. Navigate to the "Analytics" tab
2. View your:
   - Overall statistics (completions, streaks, habit strength)
   - Year-long activity heatmap
   - Daily and weekly trend charts
   - Top performing habits

### Managing Achievements

1. Navigate to the "Achievements" tab
2. View unlocked and locked achievements
3. Track progress towards new achievements

### Exporting/Importing Data

1. Navigate to the "Settings" tab
2. Click "Export to JSON" to download your data
3. Click "Import from JSON" to restore from a backup

## 🎯 How Habit Strength is Calculated

The Habit Strength score (0-100) is a composite metric based on:
- **Current Streak (40%)**: Longer streaks contribute more
- **Completion Rate (30%)**: Overall percentage of completed days
- **Consistency (20%)**: How long you've maintained the habit
- **Total Completions (10%)**: Absolute number of completions

## 📊 Data Storage

All data is stored locally in your browser using LocalStorage. This means:
- ✅ No server required
- ✅ Complete privacy (data never leaves your device)
- ✅ Works offline
- ⚠️ Data is tied to your browser (use Export/Import to transfer)
- ⚠️ Clearing browser data will delete your habits

## 🔮 Future Enhancements

Potential features for future releases:
- Cloud sync and multi-device support
- Habit reminders and notifications
- Social features (share progress, accountability partners)
- Advanced statistics and insights
- Custom achievement creation
- Habit templates
- Dark mode

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Inspiration

This project was inspired by:
- **Streaks**: iOS habit tracker known for its clean interface
- **Pattrn**: Minimalist habit tracking with beautiful visualizations
- **GitHub's contribution graph**: For the heatmap calendar design

---

Built with ❤️ for building better habits, one day at a time.
