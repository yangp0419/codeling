import { scanProject } from "@codeling/core";

const projectPath = process.argv[2] ?? process.cwd();
const result = await scanProject(projectPath);

console.log(JSON.stringify(result, null, 2));

