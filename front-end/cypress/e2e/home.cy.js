Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:5000/reset");
});

Cypress.Commands.add("seedDatabase", () => {
  cy.request("POST", "http://localhost:5000/seed/multi");
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

    cy.wait("@getRecommendations");

    cy.get("article").should("have.length.of.at.most", 10);
  });
});
