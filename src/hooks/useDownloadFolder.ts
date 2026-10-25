"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { chooseFolder, getSavedFolder, isFolderSupported } from "@/lib";

export const useDownloadFolder = () => {
  const [supported, setSupported] = useState(false);
  const [folderName, setFolderName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getSavedFolder().then((handle) => {
      if (cancelled) return;
      setSupported(isFolderSupported());
      setFolderName(handle?.name ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const choose = useCallback(async () => {
    try {
      const handle = await chooseFolder();

      if (handle) {
        setFolderName(handle.name);
        toast.success(`Downloads will be saved to "${handle.name}".`);
      }
    } catch {
      toast.error(
        "Couldn't use that folder. Create a new folder called aio-downloads and choose it.",
      );
    }
  }, []);

  return { supported, folderName, choose };
};
