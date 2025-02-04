import SeriesAPI from '../api_objects/SeriesAPI';

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


});