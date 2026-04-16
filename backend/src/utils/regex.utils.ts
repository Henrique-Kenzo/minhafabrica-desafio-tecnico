function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function createDiacriticAwareRegex(text: string): string {
  const escaped = escapeRegex(text);
  return escaped
    .replace(/a/gi, '[aáàãâäAÁÀÃÂÄ]')
    .replace(/e/gi, '[eéèêëEÉÈÊË]')
    .replace(/i/gi, '[iíìîïIÍÌÎÏ]')
    .replace(/o/gi, '[oóòõôöOÓÒÕÔÖ]')
    .replace(/u/gi, '[uúùûüUÚÙÛÜ]')
    .replace(/c/gi, '[cçCÇ]');
}
