const fs = require('fs');
const jsdom = require('jsdom');
const report = require('./report');

const { JSDOM } = jsdom;
const srcDirectory = 'src/';
const inputDirectory = 'input/';
const outputDirectory = 'output/';

fs.readdir(srcDirectory + inputDirectory, async function (err, filenames) {
    if (err) {
        console.log(err);
        return;
    }
    filenames.forEach(function (filename) {
        fs.readFile(srcDirectory + inputDirectory + filename, 'utf-8', async function (err, content) {
            if (err) {
                console.log(err);
                return;
            }
            await process(filename, content);
        });
    });
});

async function process(filename, content) {
    // Generate input file report
    await report.generate('http://localhost:8080/', srcDirectory, inputDirectory, filename);
    const dom = new JSDOM(content);
    // input elements
    dom.window.document.querySelectorAll('input')?.forEach(function (d) {
        const inputARIALabelVal = d.getAttribute('aria-label');
        if (!inputARIALabelVal) {
            const inputIdVal = d.getAttribute('id');
            const labelNode = dom.window.document.querySelector('label[for="' + inputIdVal + '"]');
            if (labelNode?.textContent) {
                d.setAttribute('aria-label', labelNode?.textContent);
            } else {
                const inputPlaceholderVal = d.getAttribute('placeholder');
                d.setAttribute('aria-label', inputPlaceholderVal);
            }
        }
    });
    // TextArea
    dom.window.document.querySelectorAll('textarea')?.forEach(function (d) {
        const textareaARIALabelVal = d.getAttribute('aria-label');
        if (!textareaARIALabelVal) {
            const textareaPlaceholderVal = d.getAttribute('placeholder');
            d.setAttribute('aria-label', textareaPlaceholderVal);
        }
    });
    // img elements
    dom.window.document.querySelectorAll('img')?.forEach(function (d) {
        const altVal = d.getAttribute('alt');
        if (!altVal) {
            const srcVal = d.getAttribute('src');
            d.setAttribute('alt', srcVal.match(/[^\/]+$/)[0]);
        }
    });
    // button elements
    dom.window.document.querySelectorAll('button')?.forEach(function (d) {
        d.setAttribute('aria-label', d?.textContent);
    });
    // Write the content
    writeOutput(filename, dom.serialize());
    // Generate output file report
    await report.generate('http://localhost:8080/', srcDirectory, outputDirectory, filename);
}

function writeOutput(filename, content) {
    fs.writeFile(srcDirectory + outputDirectory + filename, content, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log(srcDirectory + outputDirectory + filename + ' has been created successfully!');
    });
}
