import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { ProjectFile, ScanProjectResult } from "@codeling/shared";

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage"
]);

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".py",
  ".go",
  ".rs",
  ".vue"
]);

export async function scanProject(projectPath: string): Promise<ScanProjectResult> {
  const rootPath = path.resolve(projectPath);
  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error("Project path must be a directory.");
  }

  const files: ProjectFile[] = [];
  await walkDirectory(rootPath, rootPath, files);

  files.sort((first, second) => first.relativePath.localeCompare(second.relativePath));

  return {
    projectPath: rootPath,
    files
  };
}

async function walkDirectory(
  rootPath: string,
  currentPath: string,
  files: ProjectFile[]
): Promise<void> {
  const entries = await readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        await walkDirectory(rootPath, entryPath, files);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name);

    if (!CODE_EXTENSIONS.has(extension)) {
      continue;
    }

    const fileStat = await stat(entryPath);
    const relativePath = path.relative(rootPath, entryPath).split(path.sep).join("/");

    files.push({
      absolutePath: entryPath,
      relativePath,
      extension,
      size: fileStat.size
    });
  }
}

