const path = require("path");
const fse = require("fs-extra");

const packagePath = process.cwd();

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.join(packagePath, "./package.json"),
    "utf8"
  );
  const package = JSON.parse(packageData);

  const newPackageData = {
    ...package,
    main: "index.js",
    module: "index.js",
    typings: "index.d.ts",
  };

  const targetPath = path.resolve(path.join(packagePath, "dist/package.json"));

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    "utf8"
  );
  console.log("Create package.json in: ", targetPath);

  return newPackageData;
}

async function run() {
  try {
    await createPackageFile();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
}

run();
