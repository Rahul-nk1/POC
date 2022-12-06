import { useEffect } from "."

/*
  This singleton listener allows all the resize events to be called from
  this one piece of efficient code. Less overhead.
*/

type Listener = () => void

const listeners = new Set<Listener>()
const broadcast = () => listeners.forEach((listener) => listener())

let timer: ReturnType<typeof setTimeout>
const delay = 240
window.addEventListener("resize", function () {
  clearTimeout(timer)
  timer = setTimeout(broadcast, delay)
})

export const useDebouncedWindowResize = (l: Listener) => {
  useEffect(() => {
    listeners.add(l) // add to Set of Listeners
    return () => {
      listeners.delete(l) // remove from Set of Listeners
    }
  }, [l])
}
