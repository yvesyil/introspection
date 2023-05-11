export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number) {
  let timeoutID: number | undefined;

  const debounced = async (...args: Args) => {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn(...args), delay);
  };

  return debounced;
}

export function vh(percent: number) {
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (percent * h) / 100;
}

export function vw(percent: number) {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (percent * w) / 100;
}

export function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}
