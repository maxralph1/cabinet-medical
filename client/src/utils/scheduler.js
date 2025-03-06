function getDayOfWeek(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
}

function getDaysOfMonth(year, month) {
    let days = [];
    // Get the number of days in the month
    let daysInMonth = new Date(year, month + 1, 0).getDate(); 

    for (let day = 1; day <= daysInMonth; day++) {
        let date = new Date(year, month, day);
        days.push({
            date: day,
            dayOfWeek: getDayOfWeek(date) 
        });
    }

    return days;
}

function getAllDatesOfYear(year) {
    let allDates = [];

    // Loop through each month
    for (let month = 0; month < 12; month++) {
        allDates.push({
            month: month + 1,
            days: getDaysOfMonth(year, month)
        });
    }

    return allDates;
}

// Example: Get all dates with day of the week for 2025
let allDates2025 = getAllDatesOfYear(2025);
console.log(allDates2025); 

export default allDates2025;
