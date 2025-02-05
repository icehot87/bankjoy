# Interview Assessment for Bankjoy
This project is an interview assessment for Bankjoy to test Valet API of Bank of Canada using Cypress.

## Setup
### Prerequisite
This project requires Node.js and NPM as prerequisite. Please follow the instruction on [Node.js](https://nodejs.org/en/download/) to install them in your respective OS. Also make sure your hardware meets the minimum spec mentioned in this [doc](https://docs.cypress.io/app/get-started/install-cypress#Hardware) to run cypress properly.

### Install dependencies
Run the following command to install all the dependencies
```
npm install
```

### Run Cypress
There are three ways to run the Cypress tests. 

1. I have created custom commands that runs and generates report in HTML format.

| Command | Description |
|---------|-------------|
| ```npm run tests``` | Runs the tests and generate HTML test report |
| ```npm run clean``` | Clean the test reports folder |
| ```npm run report``` | Generate report if you used the last two methods to run Cypress test |

2. You can run using the regular way by running the command ```npx cypress open``` which opens the Cypress App and follow the steps in the App. Run report command to generate HTML report

3. You could also run the command ```npx cypress run``` which runs all the tests in terminal. Run report command to generate HTML report

## Observations
1. Found out that ```cy.intercept``` gets bypassed by ```cy.request```, so stubbing and mocking is not possible with API. [Cypress Doc](https://docs.cypress.io/api/commands/request#cyrequest-sends-requests-to-actual-endpoints-bypassing-those-defined-using-cyintercept)
2. I have followed POM by creating API objects and make the necessary calls from Spec files to the objects.
3. I have created [lists.spec.js](cypress/tests/lists.spec.js) to showcase, on how to handle fixed and dynamic responses using fixture
4. ```cy.request``` by default fails a test if the response is not 2xx or 3xx series, I tried to add ```failOnStatusCode: false``` globally to the cypress config but it seems to not work, so I have added it to API objects.

## Improvements
If I had more time, I would have done the following:
1. There are more negative scenarios that could be covered for that one API. E.g.,
   1. Boundary value tests for the optional parameters: start_data, end_date, recent, recent_weeks, recent_months, recent_years.
   2. Invalid date & format tests
   3. Data validation when ordering ascending or descending
   4. Optional parameters data type validation. i.e., checking the API's error handling when passing the wrong data type.
2. Implement end to end test scenarios.
3. Abstract the requests and responses to data-driven style testing. i.e., using helper methods and fixtures to store and pass data.
4. Utilize the HTML reporting plug-in Allure to create different type of test suites. e.g., Sanity, Smoke, Regression etc.
5. Create necessary workflow file to integrate these tests in CI/CD. e.g., Create yml file inside .github/workflows directory to make these tests run on GitHub Actions.
6. I would install 3rd party plug-ins like Prettier to format the code better.