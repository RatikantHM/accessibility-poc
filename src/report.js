const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const reportDirectory = 'reports/'

module.exports = {
    generate: async (baseUrl, srcDirectory, fileDirectory, filename) => {
        console.log('started!!!');
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { output: 'html', onlyCategories: ['accessibility'], port: chrome.port };
        const runnerResult = await lighthouse(baseUrl + srcDirectory + fileDirectory + filename, options);

        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        fs.writeFile(srcDirectory + reportDirectory + fileDirectory + filename, reportHtml, function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });

        // `.lhr` is the Lighthouse Result as a JS object
        console.log('Report is done for:', baseUrl + srcDirectory + fileDirectory + filename);
        console.log('Accessibility score was:', runnerResult.lhr.categories.accessibility.score * 100);

        await chrome.kill();
        console.log('done!!!');
    }
};
