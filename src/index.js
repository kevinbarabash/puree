#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");
const tmp = require("tmp");

const convert = require("./convert.js");
const bundleDep = require("./bundle-dep.js");
const bundleMain = require("./bundle-main.js");

const DEBUG = false;

const cwd = process.cwd();
const tmpObj = tmp.dirSync({
    unsafeCleanup: true,
});

program
    .version("0.0.1")
    .arguments('<srcdir>')
    .option("--outdir <outdir>", "output director", ".")
    .option("--name <name>", "bundle filename", "bundle.js")
    .option("--main <main>", "name of main PureScript module", "Main")
    .option("--deps <deps>", "dependencies to exclude from main bundle")
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

// TODO: make these paths configurable
const inputDir = path.join(cwd, program.args[0]);
const tempDir = path.join(tmpObj.name);
const outputDir = path.join(cwd, program.outdir);

const pkg = require(path.join(cwd, "package.json"));
const deps = program.deps || Object.keys(pkg.dependencies || {});

const main = async () => {
    var context = {
        warn: function (code) {
            console.warn("Warning: " + code);
        },
        error: function (code) {
            throw new Error(code);
        }
    };
    
    // Convert purs output to ES6 modules
    console.log("Upgrading purs output from ES5 to ES6: ");
    for (const dir of fs.readdirSync(inputDir)) {
        mkdirp.sync(path.join(tempDir, dir));
    
        const files = fs.readdirSync(path.join(inputDir, dir));
        for (const file of files) {
            if (file.endsWith(".js")) {
                const inputPath = path.join(inputDir, dir, file);
                const outputPath = path.join(tempDir, dir, file);
                const inputCode = fs.readFileSync(inputPath, "utf-8");
                const outputCode = convert.call(context, inputCode, inputPath).code;
                fs.writeFileSync(outputPath, outputCode, "utf-8");
                if (DEBUG) {
                    console.log(inputPath);
                } else {
                    process.stdout.write(".");
                }
            }
        }
    }
    process.stdout.write("\n");
    
    // Bundle ES6 modules and remove dead code
    await bundleMain(
        path.join(tempDir, program.main, "index.js"), 
        path.join(outputDir, program.name),
    );
    
    for (const dep of deps) {
        try {
            const output = await bundleDep(dep);
            const outputPath = path.join(outputDir, `${dep}.js`);
            fs.writeFileSync(outputPath, output, "utf-8");
            console.log(`wrote ${outputPath}`);
        } catch (error) {
            console.log(`error: ${error}`);
        };
    }

    // clean-up temp folder
    tmpObj.removeCallback();
}

main();
