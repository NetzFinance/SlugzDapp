export function formatUnixTimestamp(unixTimestamp: number | string) {
  const date = new Date(Number(unixTimestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
