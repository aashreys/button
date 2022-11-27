export function getFormattedUrl(url: string): string {
  if (url.length > 0 && url.indexOf(':') < 0) {
    url = 'https://' + url
  }
  return url
}