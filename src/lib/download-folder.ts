const DB_NAME = "aio-downloader";
const STORE_NAME = "handles";
const FOLDER_KEY = "download-folder";
const DECLINED_KEY = "aio-folder-declined";

export const FOLDER_NAME = "aio-downloads";

interface DirectoryHandleWithPermission extends FileSystemDirectoryHandle {
  queryPermission: (descriptor?: {
    mode?: "read" | "readwrite";
  }) => Promise<PermissionState>;

  requestPermission: (descriptor?: {
    mode?: "read" | "readwrite";
  }) => Promise<PermissionState>;
}

interface WindowWithDirectoryPicker extends Window {
  showDirectoryPicker: (options?: {
    id?: string;
    mode?: "read" | "readwrite";
    startIn?:
      | "desktop"
      | "documents"
      | "downloads"
      | "music"
      | "pictures"
      | "videos"
      | FileSystemHandle;
  }) => Promise<FileSystemDirectoryHandle>;
}

const permission = { mode: "readwrite" } as const;

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const readHandle = async (): Promise<DirectoryHandleWithPermission | null> => {
  try {
    const db = await openDb();

    return await new Promise((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME)
        .objectStore(STORE_NAME)
        .get(FOLDER_KEY);

      request.onsuccess = () =>
        resolve(
          (request.result as DirectoryHandleWithPermission | undefined) ?? null,
        );

      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

const writeHandle = async (
  handle: DirectoryHandleWithPermission,
): Promise<void> => {
  try {
    const db = await openDb();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put(handle, FOLDER_KEY);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    // Storage unavailable (private mode):
    // the folder just won't be remembered.
  }
};

const wasDeclined = (): boolean => {
  try {
    return localStorage.getItem(DECLINED_KEY) === "1";
  } catch {
    return false;
  }
};

const setDeclined = (value: boolean): void => {
  try {
    if (value) {
      localStorage.setItem(DECLINED_KEY, "1");
    } else {
      localStorage.removeItem(DECLINED_KEY);
    }
  } catch {
    // Storage unavailable:
    // the choice just won't be remembered.
  }
};

const requestAccess = async (
  handle: DirectoryHandleWithPermission,
): Promise<boolean> => {
  try {
    if ((await handle.queryPermission(permission)) === "granted") {
      return true;
    }

    return (await handle.requestPermission(permission)) === "granted";
  } catch {
    return false;
  }
};

const fileExists = async (
  folder: FileSystemDirectoryHandle,
  name: string,
): Promise<boolean> => {
  try {
    await folder.getFileHandle(name);
    return true;
  } catch (error) {
    if ((error as DOMException).name === "NotFoundError") {
      return false;
    }

    throw error;
  }
};

export const isFolderSupported = (): boolean =>
  typeof window !== "undefined" && "showDirectoryPicker" in window;

export const getSavedFolder =
  (): Promise<DirectoryHandleWithPermission | null> => readHandle();

export const chooseFolder =
  async (): Promise<DirectoryHandleWithPermission | null> => {
    try {
      const browserWindow = window as unknown as WindowWithDirectoryPicker;

      const picked = await browserWindow.showDirectoryPicker({
        id: FOLDER_NAME,
        mode: "readwrite",
        startIn: "downloads",
      });

      const target =
        picked.name === FOLDER_NAME
          ? picked
          : await picked.getDirectoryHandle(FOLDER_NAME, {
              create: true,
            });

      const directoryHandle = target as DirectoryHandleWithPermission;

      await writeHandle(directoryHandle);

      setDeclined(false);

      return directoryHandle;
    } catch (error) {
      if ((error as DOMException).name === "AbortError") {
        return null;
      }

      throw error;
    }
  };

// Must be called straight from a click:
// the picker and permission prompt both need
// the user activation that the click provides.
export const resolveDownloadFolder = async (
  onFirstPrompt?: () => void,
): Promise<DirectoryHandleWithPermission | null> => {
  if (!isFolderSupported()) {
    return null;
  }

  try {
    const saved = await readHandle();

    if (saved) {
      return (await requestAccess(saved)) ? saved : null;
    }

    if (wasDeclined()) {
      return null;
    }

    onFirstPrompt?.();

    const chosen = await chooseFolder();

    if (!chosen) {
      setDeclined(true);
    }

    return chosen;
  } catch {
    return null;
  }
};

// "video.mp4" -> "video (1).mp4"
// so we never overwrite an existing file.
export const uniqueFileName = async (
  folder: FileSystemDirectoryHandle,
  name: string,
): Promise<string> => {
  const dot = name.lastIndexOf(".");

  const base = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : "";

  let candidate = name;
  let index = 1;

  while (await fileExists(folder, candidate)) {
    candidate = `${base} (${index})${extension}`;
    index += 1;
  }

  return candidate;
};
