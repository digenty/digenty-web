const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

const EXCLUDED_PREFIXES = [
  "/staff",
  "/api",
  "/_next",
  "http://",
  "https://",
  "#"
];

function shouldUpdateRoute(route) {
  return (
    route.startsWith("/staff/") &&
    !EXCLUDED_PREFIXES.some(prefix => route.startsWith(prefix))
  );
}

function updateContent(content) {

  // matches "/staff/something"
  return content.replace(
    /(["'`])\/(.*?)\1/g,
    (match, quote, route) => {

      const fullRoute = `/staff/${route}`;

      if (!shouldUpdateRoute(fullRoute)) {
        return match;
      }

      return `${quote}/staff/${route}${quote}`;
    }
  );
}

function processFile(filePath) {

  const content = fs.readFileSync(filePath, "utf8");

  const updated = updateContent(content);

  if (content !== updated) {

    fs.writeFileSync(filePath, updated);

    console.log("Updated:", filePath);
  }
}

function walkDir(dir) {

  const files = fs.readdirSync(dir);

  for (const file of files) {

    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {

      if (file === "node_modules" || file.startsWith(".")) {
        continue;
      }

      walkDir(fullPath);

    } else {

      if (FILE_EXTENSIONS.includes(path.extname(file))) {
        processFile(fullPath);
      }
    }
  }
}

walkDir(ROOT_DIR);

console.log("Done updating routes.");