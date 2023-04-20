export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number) {
  let timeoutID: number | undefined;

  const debounced = async (...args: Args) => {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn(...args), delay);
  };

  return debounced;
}