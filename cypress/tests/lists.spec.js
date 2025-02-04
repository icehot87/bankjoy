import ListsAPI from '../api_objects/ListsAPI';

describe('Lists API', () => {
    it('should return a list of series (200)', () => {
      const type = 'series';
      const format = 'json';
  
      ListsAPI.getLists(type, format).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.contain('application/json'); // Check content type
        expect(response.body).to.have.property('terms');
        expect(response.body).to.have.property('series');
  
        // Check if a specific series exists
        expect(response.body.series).to.have.property('IEXE0102');
        expect(response.body.series.IEXE0102).to.have.property('label', 'USD_CLOSE');
    })
    });

    it('should return a 400 error for invalid input', () => {
        const type = 'series';
        const format = 'pdf';
    
        ListsAPI.getLists(type, format).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.headers['content-type']).to.contain('application/json');
          
          // This type of validation is best if the response body is not dynamic
          // Pass the response body from fixture to compare
          cy.fixture('400_response.json').then((expectedResponse) =>{
            expect(response.body).to.deep.equal(expectedResponse);
          })
        });
      });

      it('should return a 404 error for unavailable data', () => {
        const type = 'not_available_series';
        const format = 'json';
  
        ListsAPI.getLists(type, format).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.headers['content-type']).to.contain('application/json');

          // If the response body is dynamic, we can parse the JSON and then replace the dynamic element before comparing
          cy.fixture('404_response.json').then((expectedResponse) => {
            const dynamicExpectedResponse = JSON.parse(JSON.stringify(expectedResponse)); // This will do a deep copy
            dynamicExpectedResponse.message = dynamicExpectedResponse.message.replace('{series}', type); // Replace the required placeholder
            expect(response.body).to.deep.equal(dynamicExpectedResponse)
          })
        });
    });
  });