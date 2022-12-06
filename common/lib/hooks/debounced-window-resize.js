import { useEffect } from "."
const listeners = new Set()
const broadcast = () => listeners.forEach((listener) => listener())
let timer
const delay = 240
window.addEventListener("resize", function () {
  clearTimeout(timer)
  timer = setTimeout(broadcast, delay)
})
export const useDebouncedWindowResize = (l) => {
  useEffect(() => {
    listeners.add(l) // add to Set of Listeners
    return () => {
      listeners.delete(l) // remove from Set of Listeners
    }
  }, [l])
}
//# sourceMappingURL=debounced-window-resize.js.map
