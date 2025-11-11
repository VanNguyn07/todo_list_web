
const handleHomeClick = () => {
    console.log("Clicked button Home")
}
const handleTaskClick = () => {
    console.log("Clicked button Task")
}
const handlePomodoroClick = () => {
    console.log("Clicked button Pomodoro")
}
const handleAnalyticsClick = () => {
    console.log("Clicked button Analytics")
}

const handleQuickNotesClick = () => {
    console.log("Clicked button Quick Notes")
}

const handleHabitTrackerClick = () => {
    console.log("Clicked button Habit Tracker")
}

const handleCalendarClick = () => {
    console.log("Clicked button Calendar")
}
const handleSettingsClick = () => {
    console.log("Clicked button Settings")
}

const handleContactClick = () => {
    console.log("Clicked button Contact")
}

export const buttonClickHandles = {
    home: handleHomeClick,
    task: handleTaskClick,
    pomodoro: handlePomodoroClick,
    analytics: handleAnalyticsClick,
    "quick-notes": handleQuickNotesClick,
    "habit-tracker": handleHabitTrackerClick,
    calendar: handleCalendarClick,
    settings: handleSettingsClick,
    contact: handleContactClick
};