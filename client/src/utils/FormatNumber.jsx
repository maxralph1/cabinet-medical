import dayjs from 'dayjs';

const formatNumber = (number) => {
  if (number >= 1000000000000) {
    return `${(number / 1000000000000).toFixed()}T+`; // Trillions
  } else if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed()}B+`; // Billions
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed()}M+`; // Millions
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed()}k+`; // Thousands
  } else {
    return number; // Return the number as is if less than 1000
  }
}; 

export default formatNumber; 