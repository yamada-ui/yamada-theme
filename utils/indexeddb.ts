import type { ComponentStyle, Theme } from "@yamada-ui/react"

let db: IDBDatabase

const DATA_BASE_VER = 1
const DATA_BASE_NAME = "YamadaThemeDB"
const DATA_BASE_STORE = "theme"
const DATA_BASE_KEY_PATH = "id"

export interface SaveThemeData {
  id: string
  components: SaveComponentThemeData
}

export type SaveComponentThemeData = Partial<{
  [T in keyof Theme["components"]]: ComponentStyle<T>
}>

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATA_BASE_NAME, DATA_BASE_VER)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(DATA_BASE_STORE))
        db.createObjectStore(DATA_BASE_STORE, { keyPath: DATA_BASE_KEY_PATH })
    }

    request.onsuccess = (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

export const getTheme = async (
  themeName: string,
): Promise<SaveThemeData | undefined> => {
  if (!db) db = await openDatabase()

  const transaction = db.transaction([DATA_BASE_STORE], "readonly")
  const store = transaction.objectStore(DATA_BASE_STORE)
  const request: IDBRequest<SaveThemeData | undefined> = store.get(themeName)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const themeData = request.result
      resolve(themeData)
    }
    request.onerror = () => reject(request.error)
  })
}

export const getThemeForComponent = async (
  themeName: string,
  componentName: keyof Theme["components"],
): Promise<ComponentStyle | undefined> => {
  if (!db) db = await openDatabase()

  const transaction = db.transaction([DATA_BASE_STORE], "readonly")
  const store = transaction.objectStore(DATA_BASE_STORE)
  const request: IDBRequest<SaveThemeData | undefined> = store.get(themeName)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const componentThemeData = request.result?.components
      resolve(componentThemeData?.[componentName] ?? undefined)
    }
    request.onerror = () => reject(request.error)
  })
}

export const saveTheme = async (theme: SaveThemeData): Promise<void> => {
  if (!db) db = await openDatabase()

  const transaction = db.transaction([DATA_BASE_STORE], "readwrite")
  const store = transaction.objectStore(DATA_BASE_STORE)
  const request = store.put(theme)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const saveThemeForComponent = async (
  themeName: string,
  componentName: keyof Theme["components"],
  theme: ComponentStyle,
): Promise<void> => {
  if (!db) db = await openDatabase()

  const transaction = db.transaction([DATA_BASE_STORE], "readwrite")
  const store = transaction.objectStore(DATA_BASE_STORE)

  const newData = {
    id: themeName,
    components: {
      [componentName]: theme,
    },
  }

  const request = store.put(newData)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
