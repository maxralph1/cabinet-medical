export const getRangeStart = (range, todayStart, weekStart, monthStart, yearStart) => {
  return (range === 'today') ? todayStart
       : (range === 'this-week') ? weekStart
       : (range === 'this-month') ? monthStart
       : (range === 'this-year') ? yearStart
       : '';
};

export const getPreviousRangeStart = (range, yesterdayStart, lastWeekStart, lastMonthStart, lastYearStart) => {
  return (range === 'today') ? yesterdayStart
       : (range === 'this-week') ? lastWeekStart
       : (range === 'this-month') ? lastMonthStart
       : (range === 'this-year') ? lastYearStart
       : '';
};

export const getRangeEnd = (range, todayEnd, weekEnd, monthEnd, yearEnd) => {
  return (range === 'today') ? todayEnd
       : (range === 'this-week') ? weekEnd
       : (range === 'this-month') ? monthEnd
       : (range === 'this-year') ? yearEnd
       : '';
};

export const getPreviousRangeEnd = (range, yesterdayEnd, lastWeekEnd, lastMonthEnd, lastYearEnd) => {
  return (range === 'today') ? yesterdayEnd
       : (range === 'this-week') ? lastWeekEnd
       : (range === 'this-month') ? lastMonthEnd
       : (range === 'this-year') ? lastYearEnd
       : '';
};
