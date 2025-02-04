const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
    baseUrl: 'https://www.bankofcanada.ca/valet',
    specPattern: [
      'cypress/tests/**/*.spec.{js,jsx,ts,tsx}',
    ],
    },
    defaultCommandOptions: {
      'cy.request': {
        failOnStatusCode: false, // Seems to not affect globally
      },
    },
  },
);
