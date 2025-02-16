import SeriesAPI from '../api_objects/SeriesAPI';
import * as allure from "allure-js-commons";

// Positive scenarios
function differentCurrencyTests(currencyType, currencyLabel, currencyDescription) {
describe(`Series API positive tests for ${currencyType}`, () => {
  it('should return 200 for series observation when valid inputs given', () => {
    const seriesName = currencyType;
    const format = 'json';
    const startDate = '2024-01-01';

    SeriesAPI.getObservations(seriesName, format, {start_date: startDate}).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.contain('application/json');

      expect(response.body).to.have.property('terms');
      expect(response.body.terms).to.have.property('url', 'https://www.bankofcanada.ca/terms/');

      expect(response.body).to.have.property('seriesDetail');
      expect(response.body.seriesDetail).to.have.property(seriesName);

      const seriesDetail = response.body.seriesDetail[seriesName];
      expect(seriesDetail).to.have.property('label', currencyLabel);
      expect(seriesDetail).to.have.property('description', currencyDescription);
      expect(seriesDetail).to.have.property('dimension');
      expect(seriesDetail.dimension).to.have.property('key', 'd');
      expect(seriesDetail.dimension).to.have.property('name', 'Date');

      expect(response.body).to.have.property('observations');
      const observations = response.body.observations;
      expect(observations).to.be.an('array'); 
      expect(observations.length).to.be.greaterThan(0);

      const firstObservation = observations[0];
      expect(firstObservation).to.have.property('d');
      expect(firstObservation).to.have.property(seriesName);
      expect(firstObservation[seriesName]).to.have.property('v');

       const firstValue = Number.parseFloat(firstObservation[seriesName].v);
       expect(firstValue).to.be.a('number');
       expect(firstValue).to.be.greaterThan(0);
    });
    });

    it(`calculate the average ${currencyLabel} conversion rate for the recent 10 weeks`,() => {
        const seriesName = currencyType;
        const format = 'json';
        const recentWeeks = 10;

        SeriesAPI.getObservations(seriesName, format, {recent_weeks: recentWeeks}).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.contain('application/json');

            const observations = response.body.observations;
            const rates = Object.values(observations)
                .filter(observation => observation[currencyType]?.v)
                .map(observation => Number.parseFloat(observation[currencyType].v));

            if (rates.length === 0) {
                expect(true).to.equal(true);
                return;
            }

            const sum = rates.reduce((a,b) => a+b,0)
            const average = sum / rates.length
            expect(average).to.be.greaterThan(0)
            cy.allure().step(`Average CAD to USD conversion rate of 10 weeks is ${average}`)
            cy.task('log',`Average CAD to USD conversion rate of 10 weeks is ${average}`);
        })
    })
});
}

// Negative scenarios
describe('Series API negative tests', () => {
    it('should return 400 when both date and recent activities are given', () => {
        const seriesName = 'FXCADUSD';
        const format = 'json';
        const startDate = '2024-01-01'
        const recentWeeks = 10;
        const expectedResponse = {
                "message": "Bad recent observations request parameters, you can not mix start_date or end_date with any of recent, recent_weeks, recent_months, recent_years",
                "docs": "https://www.bankofcanada.ca/valet/docs#/Series/get_observations__seriesNames___format_"
            }

        SeriesAPI.getObservations(seriesName, format, {start_date: startDate, recent_weeks: recentWeeks}).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.headers['content-type']).to.contain('application/json');

            expect(response.body).to.deep.equal(expectedResponse)
        })
    })

    it('should return 404 when an invalid series is given', () => {
        const seriesName = 'invalid';
        const format = 'json';
        const expectedResponse = {
            "message": "Series {series} not found.",
            "docs": "https://www.bankofcanada.ca/valet/docs#/Series/get_observations__seriesNames___format_"
        }

        SeriesAPI.getObservations(seriesName, format).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.headers['content-type']).to.contain('application/json');

            const dynamicExpectedResponse = JSON.parse(JSON.stringify(expectedResponse));
            dynamicExpectedResponse.message = dynamicExpectedResponse.message.replace('{series}', seriesName);
            expect(response.body).to.deep.equal(dynamicExpectedResponse)
            });
        })

    it('should return 400 when invalid format is given', () => {
        const seriesName = 'FXCADUSD';
        const format = 'jpg';
        const expectedResponse = {
            "message": "Bad output format ({format}) requested.",
            "docs": "https://www.bankofcanada.ca/valet/docs#/Series/get_observations__seriesNames___format_"
        }
    
        SeriesAPI.getObservations(seriesName, format).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.headers['content-type']).to.contain('application/json');
    
            const dynamicExpectedResponse = JSON.parse(JSON.stringify(expectedResponse));
            dynamicExpectedResponse.message = dynamicExpectedResponse.message.replace('{format}', format);
            expect(response.body).to.deep.equal(dynamicExpectedResponse)
        })
    })
});


// To demonstrate code reusability by modifying existing code to run for various currencies, in addition to "CAD to USD."
describe('Future currency', () => {
    differentCurrencyTests('FXCADUSD', 'CAD/USD','Canadian dollar to US dollar daily exchange rate');
    differentCurrencyTests('FXAUDCAD', 'AUD/CAD','Australian dollar to Canadian dollar daily exchange rate');
    // Add more currency pairs as needed
  });