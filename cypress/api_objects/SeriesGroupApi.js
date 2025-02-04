class SeriesGroupAPI {
    // Provides the details associated with a group by its group name
    getGroupDetails(groupName, format) {
      return cy.request({
        method: 'GET',
        url: `/groups/${groupName}/${format}`,
        failOnStatusCode: false,
      });
    }
  
    // Returns observations of a group of series, filtered by a group name
    getGroupObservations(groupName, format) {
      return cy.request({
        method: 'GET',
        url: `/observations/group/${groupName}/${format}`,
        failOnStatusCode: false,
      });
    }
  }
  
  export default new SeriesGroupAPI();