import { useState } from "react";
import type { ScanProjectResult } from "@codeling/shared";
import type { AppStatus } from "../types";
import { getErrorMessage } from "../lib/format";

interface UseProjectScanResult {
  projectPath: string | null;
  scanResult: ScanProjectResult | null;
  status: AppStatus;
  errorMessage: string | null;
  isSelecting: boolean;
  isScanning: boolean;
  selectProject: (onSelected?: () => void) => Promise<void>;
  scanProject: (onSuccess?: () => void) => Promise<void>;
}

export function useProjectScan(): UseProjectScanResult {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanProjectResult | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function selectProject(onSelected?: () => void): Promise<void> {
    setStatus("selecting");
    setErrorMessage(null);
    try {
      const selectedPath = await window.codeling.selectProjectDirectory();
      if (selectedPath) {
        setProjectPath(selectedPath);
        setScanResult(null);
        setStatus("idle");
        onSelected?.();
      } else {
        setStatus("idle");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    }
  }

  async function scanProject(onSuccess?: () => void): Promise<void> {
    if (!projectPath) return;
    setStatus("scanning");
    setErrorMessage(null);
    try {
      const result = await window.codeling.scanProject(projectPath);
      setScanResult(result);
      setStatus("ready");
      onSuccess?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    }
  }

  return {
    projectPath,
    scanResult,
    status,
    errorMessage,
    isSelecting: status === "selecting",
    isScanning: status === "scanning",
    selectProject,
    scanProject
  };
}
