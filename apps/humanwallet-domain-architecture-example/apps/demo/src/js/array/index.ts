export function shuffleArray<T>(array: Array<T>): Array<T> {
  const newArray = array.slice()
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

type NestedArray<T> = Array<T | NestedArray<T>>

export function isLastElementInAnyArray<T>(data: NestedArray<T>, target: T): boolean {
  function search(arr: NestedArray<T>): boolean {
    if (arr.length > 0 && arr[arr.length - 1] === target) {
      return true
    }

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i]) && search(arr[i] as NestedArray<T>)) {
        return true
      }
    }

    return false
  }

  return search(data)
}
