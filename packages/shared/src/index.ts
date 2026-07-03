export interface ProjectFile {
  absolutePath: string;
  relativePath: string;
  extension: string;
  size: number;
}

export interface ScanProjectResult {
  projectPath: string;
  files: ProjectFile[];
}

export interface CodelingApi {
  selectProjectDirectory: () => Promise<string | null>;
  scanProject: (projectPath: string) => Promise<ScanProjectResult>;
}

