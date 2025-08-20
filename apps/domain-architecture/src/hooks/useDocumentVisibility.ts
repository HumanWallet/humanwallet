import { useState, useEffect } from "react"

function getVisibility(): boolean {
  if (typeof document === "undefined") return true
  return document.visibilityState === "visible"
}

export function useDocumentVisibility(): boolean {
  const [documentVisibility, setDocumentVisibility] = useState<boolean>(getVisibility())

  function handleVisibilityChange(): void {
    const visibility = getVisibility()
    setDocumentVisibility(visibility)
  }

  useEffect(() => {
    window.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return documentVisibility
}
