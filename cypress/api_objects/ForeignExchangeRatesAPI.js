class ForeignExchangeRatesAPI {
    // Return exchange rate observations
    getExchangeRates() {
      return cy.request({
        method: 'GET',
        url: '/fx_rss',
        failOnStatusCode: false,
      });
    }
  
    // Return exchange rate observations filtered by series name
    getFilteredExchangeRates(seriesNames) {
      return cy.request({
        method: 'GET',
        url: `/fx_rss/${seriesNames}`,
        failOnStatusCode: false,
      });
    }
  }
  
  export default new ForeignExchangeRatesAPI();