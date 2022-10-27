const { writeFile } = require('fs/promises');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const reportDirectory = 'reports/'

module.exports = {
    generate: async (baseUrl, srcDirectory, fileDirectory, filename) => {
        console.log('Generating report for:', baseUrl + srcDirectory + fileDirectory + filename);
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { output: 'html', onlyCategories: ['accessibility'], port: chrome.port };
        const runnerResult = await lighthouse(baseUrl + srcDirectory + fileDirectory + filename, options);

        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        await writeFile(srcDirectory + reportDirectory + fileDirectory + filename, reportHtml);

        // `.lhr` is the Lighthouse Result as a JS object
        console.log('Report is generated for:', baseUrl + srcDirectory + fileDirectory + filename);
        console.log('Accessibility score was:', runnerResult.lhr.categories.accessibility.score * 100);

        await chrome.kill();
    }
};
