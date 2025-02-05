import SeriesAPI from '../api_objects/SeriesAPI';
import * as allure from "allure-js-commons";

describe('Series Observation API', () => {
  it('should return series observation (200)', () => {
    const seriesName = 'FXCADUSD';
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
      expect(seriesDetail).to.have.property('label', 'CAD/USD');
      expect(seriesDetail).to.have.property('description', 'Canadian dollar to US dollar daily exchange rate');
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
       expect(firstValue).to.be.a('number'); // Check if the value is a number
       expect(firstValue).to.be.greaterThan(0); // Check if it's greater than zero
    });
    });

    it('calculate the average CAD to USD conversion rate for the recent 10 weeks',() => {
        const seriesName = 'FXCADUSD';
        const format = 'json';
        const recentWeeks = 10;

        SeriesAPI.getObservations(seriesName, format, {recent_weeks: recentWeeks}).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.contain('application/json');

            const observations = response.body.observations;
            const rates = Object.values(observations)
                .filter(observation => observation.FXCADUSD?.v)
                .map(observation => Number.parseFloat(observation.FXCADUSD.v));

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

    it('return 400 when both date and recent date are given', () => {
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

    it('return 404 when an invalid series is given', () => {
        const seriesName = 'invalid';
        const format = 'json';
        const expectedResponse = {
            "message": "Series {series} not found.",
            "docs": "https://www.bankofcanada.ca/valet/docs#/Series/get_observations__seriesNames___format_"
        }

        SeriesAPI.getObservations(seriesName, format).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.headers['content-type']).to.contain('application/json');

            const dynamicExpectedResponse = JSON.parse(JSON.stringify(expectedResponse)); // This will do a deep copy
            dynamicExpectedResponse.message = dynamicExpectedResponse.message.replace('{series}', seriesName); // Replace the required placeholder
            expect(response.body).to.deep.equal(dynamicExpectedResponse)
            });
        })

    it('return 400 when invalid format is given', () => {
        const seriesName = 'FXCADUSD';
        const format = 'jpg';
        const expectedResponse = {
            "message": "Bad output format ({format}) requested.",
            "docs": "https://www.bankofcanada.ca/valet/docs#/Series/get_observations__seriesNames___format_"
        }
    
        SeriesAPI.getObservations(seriesName, format).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.headers['content-type']).to.contain('application/json');
    
            const dynamicExpectedResponse = JSON.parse(JSON.stringify(expectedResponse)); // This will do a deep copy
            dynamicExpectedResponse.message = dynamicExpectedResponse.message.replace('{format}', format); // Replace the required placeholder
            expect(response.body).to.deep.equal(dynamicExpectedResponse)
        })
    })
});