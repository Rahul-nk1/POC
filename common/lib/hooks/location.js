import { useEffect, useRef } from "."
export function useLocationChange(onLocationChange) {
  // const [{ location: { href } }] = useHistory();
  // TODO: useHistory is broken, ask core?
  const { href } = location
  const orig = useRef(href)
  useEffect(() => {
    if (href !== orig.current) {
      onLocationChange(href, orig.current)
      orig.current = href
    }
  }, [href, onLocationChange])
}
//# sourceMappingURL=location.js.map
