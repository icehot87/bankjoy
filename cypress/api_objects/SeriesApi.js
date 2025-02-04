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
    getObservations(seriesNames, format, options = {}) {
        let url = `/observations/${seriesNames}/${format}`;
        const queryParams = [];
    
        if (options && Object.keys(options).length > 0) { 
            for (const key in options) {
                if (Object.prototype.hasOwnProperty.call(options, key)) {
                    queryParams.push(`${key}=${options[key]}`);
                }
            }
          url += `?${queryParams.join('&')}`;
        }
    
        return cy.request({
          method: 'GET',
          url,
          failOnStatusCode: false,
      });
    }
  }
  
  export default new SeriesAPI();