const fs = require('fs');
const { readFile, writeFile } = require('fs/promises');
const accessibility = require('./accessibility');
const report = require('./report');

const srcDirectory = 'src/';
const inputDirectory = 'input/';
const outputDirectory = 'output/';

fs.readdir(srcDirectory + inputDirectory, async function (err, filenames) {
    if (err) {
        console.log(err);
        return;
    }
    for (const filename of filenames) {
        const content = await readFile(srcDirectory + inputDirectory + filename, 'utf-8');
        await process(filename, content);
        console.log('-------------------------------------------------------------------');
    }
});

async function process(filename, content) {
    // Generate input file report
    await report.generate('http://localhost:8080/', srcDirectory, inputDirectory, filename);

    // Validate accessibility
    console.log('Processing accessibility for file:', srcDirectory + inputDirectory + filename);
    const dom = accessibility.process(content);

    // Write the content
    await writeFile(srcDirectory + outputDirectory + filename, dom.serialize());
    console.log(srcDirectory + outputDirectory + filename, 'file was created successfully!');

    // Generate output file report
    await report.generate('http://localhost:8080/', srcDirectory, outputDirectory, filename);
}
