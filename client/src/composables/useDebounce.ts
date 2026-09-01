export function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timeout: number | undefined

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      callback(...args)
    }, ms)
  }
}
