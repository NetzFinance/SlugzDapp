export function formatNumber(number: number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
}
