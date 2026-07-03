import { useEffect, useState } from "react";
import type { AiApiConfig } from "@codeling/shared";
import { getErrorMessage } from "../lib/format";

interface UseAiConfigResult {
  config: AiApiConfig;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  hasApiKey: boolean;
  setConfig: (config: AiApiConfig) => void;
  saveConfig: (config: AiApiConfig, onSuccess?: () => void) => Promise<void>;
}

const EMPTY_CONFIG: AiApiConfig = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini"
};

export function useAiConfig(): UseAiConfigResult {
  const [config, setConfig] = useState<AiApiConfig>(EMPTY_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig(): Promise<void> {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const savedConfig = await getCodelingApi().getAiConfig();
        if (isMounted) {
          setConfig(savedConfig);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveConfig(nextConfig: AiApiConfig, onSuccess?: () => void): Promise<void> {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const savedConfig = await getCodelingApi().saveAiConfig(nextConfig);
      setConfig(savedConfig);
      onSuccess?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    config,
    isLoading,
    isSaving,
    errorMessage,
    hasApiKey: Boolean(config.apiKey.trim()),
    setConfig,
    saveConfig
  };
}

function getCodelingApi(): Window["codeling"] {
  if (!window.codeling) {
    throw new Error("Electron preload 未加载，请重启应用后再试。");
  }

  return window.codeling;
}
