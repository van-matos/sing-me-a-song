Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:5000/reset-database");
});

Cypress.Commands.add("seedDatabase", () => {
  cy.request("POST", "http://localhost:5000/seed/recommendations");
});

beforeEach(() => {
  cy.resetDatabase();
  cy.seedDatabase();
});

describe("Home page", () => {
  it("Home recommendations render", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );
    cy.wait("@getRecommendations").then((interception) => {
      const status = interception.response.statusCode;
      const length = interception.response.body.length;
      expect(length).to.be.below(11);
      expect(status).eq(200);
    });
  });
});
