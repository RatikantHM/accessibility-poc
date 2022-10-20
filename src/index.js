const fs = require('fs');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const inputDirectory = 'src/input/';
const outputDirectory = 'src/output/';

fs.readdir(inputDirectory, function (err, filenames) {
    if (err) {
        console.log(err);
        return;
    }
    filenames.forEach(function (filename) {
        fs.readFile(inputDirectory + filename, 'utf-8', function (err, content) {
            if (err) {
                console.log(err);
                return;
            }
            process(filename, content);
        });
    });
});

function process(filename, content) {
    const dom = new JSDOM(content, { includeNodeLocations: true });
    dom.window.document.querySelectorAll('input')?.forEach(function (d) {
        const inputARIALabelVal = d.getAttribute('aria-label');
        if (!inputARIALabelVal) {
            const inputIdVal = d.getAttribute('id');
            const labelNode = dom.window.document.querySelector('label[for="' + inputIdVal + '"]');
            d.setAttribute('aria-label', labelNode?.textContent || '');
        }
    });
    dom.window.document.querySelectorAll('img')?.forEach(function (d) {
        const altVal = d.getAttribute('alt');
        if (!altVal) {
            const srcVal = d.getAttribute('src');
            d.setAttribute('alt', srcVal.match(/[^\/]+$/)[0]);
        }
    });
    // console.log(dom.serialize());
    writeOutput(filename, dom.serialize());
}

function writeOutput(filename, content) {
    fs.writeFile(outputDirectory + filename, content, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log(outputDirectory + filename + ' has been created successfully!');
    });
}
