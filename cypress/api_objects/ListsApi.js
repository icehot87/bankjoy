class ListsAPI {
  // List of available series or group
    getLists(type, format) {
    return cy.request({
      method: 'GET',
      url: `/lists/${type}/${format}`,
      failOnStatusCode: false, // This is to handle 4xx and 5xx cases
    });
  }
}

export default new ListsAPI();