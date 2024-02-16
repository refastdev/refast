import { sha256 } from 'js-sha256';

const UNIT_SEPARATOR = '\u001F';

function hexToBase64(hexStr: string) {
  let base64 = '';
  for (let i = 0; i < hexStr.length; i++) {
    base64 += !((i - 1) & 1)
      ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16))
      : '';
  }
  return btoa(base64);
}

export function generateTextId(text: string, context = '') {
  return hexToBase64(sha256(text + UNIT_SEPARATOR + (context || ''))).slice(0, 6);
}

export function formatString(formatStr: string | undefined, args: any) {
  if (formatStr === undefined || args === undefined || typeof args !== 'object') {
    return formatStr;
  }
  return formatStr
    .replace(/{{/g, '___PLACEHOLDER___LEFT')
    .replace(/}}/g, '___PLACEHOLDER___RIGHT')
    .replace(/\{(\w+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(args, key) ? args[key] : match;
    })
    .replace(/___PLACEHOLDER___LEFT/g, '{')
    .replace(/___PLACEHOLDER___RIGHT/g, '}');
}
