import type { ComponentStyle, DefaultTheme, Theme } from "@yamada-ui/react"
import { toKebabCase } from "@yamada-ui/react"
import { saveAs } from "file-saver"
import JSZip from "jszip"

let db: IDBDatabase

const DATA_BASE_VER = 1
const DATA_BASE_NAME = "YamadaThemeDB"
const DATA_BASE_STORE = "theme"
const DATA_BASE_KEY_PATH = "id"

export interface SaveThemeData {
  id: string
  components: SaveComponentThemeData
}
export type SaveComponentThemeData = Partial<DefaultTheme["components"]>

export const openDatabase = async (): Promise<IDBDatabase> => {
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

export const exportThemeAsZip = async (themeName: string): Promise<void> => {
  const themeData = await getTheme(themeName)
  if (!themeData) {
    throw new Error("Theme not found")
  }

  const zip = new JSZip()

  const themeFolder = zip.folder("theme")
  if (!themeFolder) {
    throw new Error("Failed to create theme folder")
  }

  const componentsFolder = themeFolder.folder("components")
  if (!componentsFolder) {
    throw new Error("Failed to create components folder")
  }

  let imports = ""
  let exports = "export const components = {\n"

  for (const [componentName, theme] of Object.entries(themeData.components)) {
    const fileName = toKebabCase(componentName)
    const content = `export const ${componentName} = ${JSON.stringify(theme, null, 2)}`

    componentsFolder.file(`${fileName}.ts`, content)

    imports += `import { ${componentName} } from './${fileName}'\n`
    exports += `  ${componentName},\n`
  }

  exports += "}"
  const indexContent = `${imports}\n${exports}`

  componentsFolder.file("index.ts", indexContent)

  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, `${themeName}.zip`)
}
