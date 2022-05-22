export function isEvent(key: string) {
  return key.startsWith('on');
}
export function isProperty(key: string) {
  return key !== 'children' && !isEvent(key);
}

export function isNew(prev: Record<string, any>, next: Record<string, any>) {
  return function (key: string) {
    return prev[key] !== next[key]
  }
}

export function isGone(_prev: Record < string, any >, next: Record<string, any>) {
  return function (key: string) {
    return !(key in next);
  }
}