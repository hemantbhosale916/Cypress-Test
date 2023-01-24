/// <reference types="cypress" />
//***********************************************************
//This example plugins/index.js can be used to load plugins
//
//You can change the location of this file or turn off loading
//the plugins file with the 'pluginsFile' configuration option.
//
//You can read more here:
//https://on.cypress.io/plugins-guide
//***********************************************************

//This function is called when a project is opened or re-opened (e.g. due to
//the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
//eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  //`on` is used to hook into various events Cypress emits
  //`config` is the resolved Cypress config

  on("before:browser:launch", (browser, launchOptions) => {
    console.log("..browser ", launchOptions);

    if (browser.name === "chrome") {
      //launchOptions.args.push('--disable-site-isolation-trials');

      //launchOptions.args.push('--reduce-security-for-testing');

      //launchOptions.args.push('--out-of-blink-cors');

      launchOptions.args.push("--disable-extensions");

      return launchOptions;
    }

    if (browser.name === "electron") {
      launchOptions.preferences.webPreferences.webSecurity = false;

      return launchOptions;
    }
  });

  //cypress/plugins/index.js
  module.exports = (on, config) => {
    //optional: register cypress-grep plugin code
    //https://github.com/cypress-io/cypress-grep
    require("cypress-grep/src/plugin")(config);
    //make sure to return the config object
    //as it might have been modified by the plugin
    return config;
  };

  const { rmdir } = require("fs");
  const fs = require("fs");
  const pdf = require("pdf-parse");
  const path = require("path");
  const repoRoot = path.join("");
  const parsePdf = async (pdfName) => {
    const pdfPathname = path.join(repoRoot, pdfName);
    const dataBuffer = fs.readFileSync(pdfPathname);
    return await pdf(dataBuffer);
  };
  const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");
  on("task", { downloadFile });
  on("task", {
    getPdfContent: (pdfName) => {
      return parsePdf(pdfName);
    },
  });
  on("task", {
    deleteFolder: function (folderName) {
      console.log("deleting folder %s", folderName);
      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(null);
        });
      });
    },
  });
};
