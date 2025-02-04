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
    getObservations(seriesNames, format, startDate) {
        let url = `/observations/${seriesNames}/${format}`;
    
        if (startDate) {
          url += `?start_date=${startDate}`;
        }
    
        return cy.request({
          method: 'GET',
          url,
          failOnStatusCode: false,
        });
      }
  }
  
  export default new SeriesAPI();