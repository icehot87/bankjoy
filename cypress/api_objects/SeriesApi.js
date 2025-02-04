class SeriesAPI {
    // Contains details associated with a series
    getSeriesDetails(seriesName, format) {
      return cy.request({
        method: 'GET',
        url: `/series/${seriesName}/${format}`,
        failOnStatusCode: false,
      });
    }
  
    // Returns observations filtered by a Series Name
    getObservations(seriesNames, format) {
      return cy.request({
        method: 'GET',
        url: `/observations/${seriesNames}/${format}`,
        failOnStatusCode: false,
      });
    }
  }
  
  export default new SeriesAPI();