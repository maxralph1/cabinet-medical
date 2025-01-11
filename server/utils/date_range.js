import { parseISO, startOfDay, endOfDay, subDays, 
        startOfMonth, endOfMonth, addMonths, subMonths, 
        startOfYear, endOfYear, addYears, subYears } from 'date-fns'; 

// Date Range Manipulation Functions

/**
 * Get the date range for yesterday.
 * @returns {Object} An object containing yesterdayStart and yesterdayEnd.
 */
const getYesterdayDateRange = () => {
    const yesterdayStart = startOfDay(subDays(new Date(), 1)); // Start of yesterday
    const yesterdayEnd = endOfDay(subDays(new Date(), 1)); // End of yesterday
    return { yesterdayStart, yesterdayEnd };
};

/**
 * Get the date range for today.
 * @returns {Object} An object containing todayStart and todayEnd.
 */
const getTodayDateRange = () => {
    const todayStart = startOfDay(new Date()); // Start of today
    const todayEnd = endOfDay(new Date()); // End of today
    return { todayStart, todayEnd };
};

/**
 * Get the date range for the previous week.
 * @returns {Object} An object containing lastWeekStart and lastWeekEnd.
 */
const getPreviousWeekDateRange = () => {
    const lastWeekStart = startOfDay(subDays(new Date(), 13)); // Start of the previous week
    const lastWeekEnd = endOfDay(subDays(new Date(), 7)); // End of the previous week
    return { lastWeekStart, lastWeekEnd };
};

/**
 * Get the date range for this week.
 * @returns {Object} An object containing weekStart and weekEnd.
 */
const getCurrentWeekDateRange = () => {
    const weekStart = startOfDay(subDays(new Date(), 6)); // Start of this week (7 days ago)
    const weekEnd = endOfDay(new Date()); // End of today
    return { weekStart, weekEnd };
};

/**
 * Get the date range for the previous month.
 * @returns {Object} An object containing lastMonthStart and lastMonthEnd.
 */
const getPreviousMonthDateRange = () => {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1)); // Start of the previous month
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1)); // End of the previous month
    return { lastMonthStart, lastMonthEnd };
};

/**
 * Get the date range for the current month.
 * @returns {Object} An object containing monthStart and monthEnd.
 */
const getCurrentMonthDateRange = () => {
    const monthStart = startOfMonth(new Date()); // Start of the current month
    const monthEnd = endOfMonth(new Date()); // End of the current month
    return { monthStart, monthEnd };
};

/**
 * Get the date range for the previous year.
 * @returns {Object} An object containing lastYearStart and lastYearEnd.
 */
const getPreviousYearDateRange = () => {
    const lastYearStart = startOfYear(subYears(new Date(), 1)); // Start of the previous year
    const lastYearEnd = endOfYear(subYears(new Date(), 1)); // End of the previous year
    return { lastYearStart, lastYearEnd };
};

/**
 * Get the date range for the current year.
 * @returns {Object} An object containing yearStart and yearEnd.
 */
const getCurrentYearDateRange = () => {
    const yearStart = startOfYear(new Date()); // Start of the current year
    const yearEnd = endOfYear(new Date()); // End of the current year
    return { yearStart, yearEnd };
};

export {
    getYesterdayDateRange, 
    getTodayDateRange, 
    getPreviousWeekDateRange, 
    getCurrentWeekDateRange, 
    getPreviousMonthDateRange,
    getCurrentMonthDateRange, 
    getPreviousYearDateRange, 
    getCurrentYearDateRange
};
