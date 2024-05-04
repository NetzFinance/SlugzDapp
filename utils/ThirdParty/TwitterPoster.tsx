export function postToTwitter(message: string) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
