class ListsAPI {
  getLists(type, format) {
    console.log(`/lists/${type}/${format}`)
    return cy.request({
      method: 'GET',
      url: `/lists/${type}/${format}`,
      failOnStatusCode: false,
    });
  }
}

export default new ListsAPI();