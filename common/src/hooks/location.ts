import { useEffect, useRef } from "."

type LocationChangeHandler = (current: string, old: string) => void

export function useLocationChange(onLocationChange: LocationChangeHandler) {
  // const [{ location: { href } }] = useHistory();
  // TODO: useHistory is broken, ask core?
  const { href } = location
  const orig = useRef(href)

  useEffect(() => {
    if (href != orig.current) {
      onLocationChange(href, orig.current)
      orig.current = href
    }
  }, [href, onLocationChange])
}
