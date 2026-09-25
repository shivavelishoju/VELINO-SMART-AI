const fs = require("fs");
const path = require("path");
const CONFIG = require("./config");

// ============================================================
// VELINO SMART AI — TOOL SYSTEM
// Developed By Shiva Velishoju
// ============================================================

const PROJECT_ROOT = path.resolve(CONFIG.PROJECT_ROOT);

// Folders that VELINO should never scan
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".venv",
  "venv",
  "dist",
  "build",
  "out",
  ".idea",
  ".vscode"
]);

// File types VELINO can understand
const ALLOWED_EXTENSIONS = new Set([
  ".js",
  ".html",
  ".css",
  ".json",
  ".md",
  ".txt",
  ".ino",
  ".cpp",
  ".c",
  ".h",
  ".hpp",
  ".py"
]);

// ============================================================
// SECURITY
// ============================================================

function safePath(relativePath = ".") {
  const requestedPath = path.resolve(PROJECT_ROOT, relativePath);

  // Prevent ../ from escaping the project
  if (
    requestedPath !== PROJECT_ROOT &&
    !requestedPath.startsWith(PROJECT_ROOT + path.sep)
  ) {
    throw new Error("Access denied: path is outside the VELINO project.");
  }

  return requestedPath;
}

function isIgnoredDirectory(name) {
  return IGNORED_DIRECTORIES.has(name);
}

function isAllowedFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return ALLOWED_EXTENSIONS.has(extension);
}

// ============================================================
// TOOL 1 — LIST PROJECT FILES
// ============================================================

function listProjectFiles(relativePath = ".") {
  const directory = safePath(relativePath);

  if (!fs.existsSync(directory)) {
    throw new Error(`Directory not found: ${relativePath}`);
  }

  const stat = fs.statSync(directory);

  if (!stat.isDirectory()) {
    throw new Error(`${relativePath} is not a directory.`);
  }

  const results = [];

  function scan(currentDirectory, depth = 0) {
    if (depth > 10) return;

    let entries;

    try {
      entries = fs.readdirSync(currentDirectory, {
        withFileTypes: true
      });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".env") {
        continue;
      }

      if (
        entry.isDirectory() &&
        isIgnoredDirectory(entry.name)
      ) {
        continue;
      }

      const fullPath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath, depth + 1);
      } else if (entry.isFile()) {
        if (isAllowedFile(fullPath)) {
          results.push(
            path.relative(PROJECT_ROOT, fullPath)
          );
        }
      }
    }
  }

  scan(directory);

  return {
    success: true,
    path: relativePath,
    count: results.length,
    files: results.slice(0, 1000)
  };
}

// ============================================================
// TOOL 2 — READ PROJECT FILE
// ============================================================

function readProjectFile(relativePath) {
  if (!relativePath) {
    throw new Error("File path is required.");
  }

  const filePath = safePath(relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${relativePath}`);
  }

  const stat = fs.statSync(filePath);

  if (!stat.isFile()) {
    throw new Error(`${relativePath} is not a file.`);
  }

  if (!isAllowedFile(filePath)) {
    throw new Error(
      "This file type is not supported by VELINO Smart AI."
    );
  }

  // Protect the AI from accidentally reading huge files
  const MAX_FILE_SIZE = 200000;

  if (stat.size > MAX_FILE_SIZE) {
    throw new Error(
      `File is too large. Maximum supported size is ${MAX_FILE_SIZE} bytes.`
    );
  }

  const content = fs.readFileSync(filePath, "utf8");

  return {
    success: true,
    file: relativePath,
    size: stat.size,
    content
  };
}

// ============================================================
// TOOL 3 — SEARCH PROJECT
// ============================================================

function searchProject(query) {
  if (!query || !query.trim()) {
    throw new Error("Search query is required.");
  }

  const searchTerm = query.toLowerCase().trim();

  const files = listProjectFiles(".").files;

  const matches = [];

  for (const relativePath of files) {
    if (matches.length >= 50) {
      break;
    }

    const filePath = safePath(relativePath);

    let content;

    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i]
          .toLowerCase()
          .includes(searchTerm)
      ) {
        matches.push({
          file: relativePath,
          line: i + 1,
          text: lines[i].trim().slice(0, 500)
        });
      }

      if (matches.length >= 50) {
        break;
      }
    }
  }

  return {
    success: true,
    query,
    count: matches.length,
    matches
  };
}

// ============================================================
// TOOL 4 — PROJECT INFORMATION
// ============================================================

function getProjectInfo() {
  const packagePath = path.join(
    PROJECT_ROOT,
    "package.json"
  );

  let packageJson = null;

  if (fs.existsSync(packagePath)) {
    try {
      packageJson = JSON.parse(
        fs.readFileSync(packagePath, "utf8")
      );
    } catch {
      packageJson = null;
    }
  }

  const files = listProjectFiles(".").files;

  const extensionCount = {};

  for (const file of files) {
    const extension =
      path.extname(file).toLowerCase() || "no extension";

    extensionCount[extension] =
      (extensionCount[extension] || 0) + 1;
  }

  return {
    success: true,
    projectRoot: PROJECT_ROOT,
    projectName:
      packageJson?.name || path.basename(PROJECT_ROOT),
    version:
      packageJson?.version || "unknown",
    description:
      packageJson?.description || "",
    main:
      packageJson?.main || "",
    totalFiles: files.length,
    fileTypes: extensionCount,
    dependencies:
      packageJson?.dependencies || {},
    devDependencies:
      packageJson?.devDependencies || {}
  };
}

// ============================================================
// TOOL 5 — CALCULATOR
// ============================================================

function calculate(expression) {
  if (!expression || !expression.trim()) {
    throw new Error("Expression is required.");
  }

  const cleanExpression = expression.trim();

  // Only permit basic mathematical characters.
  // No functions, variables, imports, commands, etc.
  if (!/^[0-9+\-*/().%\s]+$/.test(cleanExpression)) {
    throw new Error(
      "Only basic mathematical expressions are allowed."
    );
  }

  try {
    const result = Function(
      `"use strict"; return (${cleanExpression})`
    )();

    if (
      typeof result !== "number" ||
      !Number.isFinite(result)
    ) {
      throw new Error("Invalid calculation.");
    }

    return {
      success: true,
      expression: cleanExpression,
      result
    };
  } catch {
    throw new Error(
      "Unable to calculate the expression."
    );
  }
}

// ============================================================
// TOOL REGISTRY
// ============================================================

const tools = {
  list_project_files: {
    name: "list_project_files",

    description:
      "Lists source files inside the VELINO project.",

    execute: async (args = {}) => {
      return listProjectFiles(
        args.path || "."
      );
    }
  },

  read_project_file: {
    name: "read_project_file",

    description:
      "Reads a source code or project text file.",

    execute: async (args = {}) => {
      return readProjectFile(
        args.path
      );
    }
  },

  search_project: {
    name: "search_project",

    description:
      "Searches source files for a keyword or phrase.",

    execute: async (args = {}) => {
      return searchProject(
        args.query
      );
    }
  },

  project_info: {
    name: "project_info",

    description:
      "Returns information about the VELINO project and package.json.",

    execute: async () => {
      return getProjectInfo();
    }
  },

  calculate: {
    name: "calculate",

    description:
      "Performs safe basic mathematical calculations.",

    execute: async (args = {}) => {
      return calculate(
        args.expression
      );
    }
  }
};

// ============================================================
// RUN TOOL
// ============================================================

async function runTool(toolName, args = {}) {
  if (!toolName) {
    throw new Error("Tool name is required.");
  }

  const tool = tools[toolName];

  if (!tool) {
    throw new Error(
      `Unknown VELINO tool: ${toolName}`
    );
  }

  try {
    const result = await tool.execute(args);

    // Prevent excessively large responses
    const serialized = JSON.stringify(result);

    const MAX_OUTPUT =
      CONFIG.MAX_TOOL_OUTPUT || 12000;

    if (serialized.length > MAX_OUTPUT) {
      return {
        success: true,
        truncated: true,
        data: serialized.slice(0, MAX_OUTPUT)
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================
// TOOL DESCRIPTIONS FOR AGENT
// ============================================================

function getToolDescriptions() {
  return Object.values(tools).map(tool => ({
    name: tool.name,
    description: tool.description
  }));
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  tools,
  runTool,
  getToolDescriptions,

  // Individual functions are exported too
  // so they can be tested or reused later.
  listProjectFiles,
  readProjectFile,
  searchProject,
  getProjectInfo,
  calculate
};