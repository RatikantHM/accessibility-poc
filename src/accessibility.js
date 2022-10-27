const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
    process: (content) => {
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

        return dom;
    }
};
