// utils.js (or any name you prefer)
export function getDayOfWeek(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
}

export function getDaysOfMonth(year, month) {
    let days = [];
    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Month is 0-indexed, so we add 1

    for (let day = 1; day <= daysInMonth; day++) {
        let date = new Date(year, month, day);
        days.push({
            date: day,
            dayOfWeek: getDayOfWeek(date)
        });
    }

    return days;
}

export function getAllDatesOfYear(year) {
    let allDates = [];

    for (let month = 0; month < 12; month++) {
        allDates.push({
            month: month + 1,
            days: getDaysOfMonth(year, month)
        });
    }

    return allDates;
}
