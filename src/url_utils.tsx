export function getFormattedUrl(url: string): string {
  if (url.indexOf('https://') < 0 && url.indexOf('http://') < 0) {
    return 'https://' + url
  }
  else {
    return url
  }
}