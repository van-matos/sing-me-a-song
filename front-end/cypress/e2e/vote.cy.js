Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:5000/reset");
});

Cypress.Commands.add("seedOneDatabase", () => {
  cy.request("POST", "http://localhost:5000/seed/single");
});

beforeEach(() => {
  cy.resetDatabase();
  cy.seedOneDatabase();
});

describe("Test voting", () => {
  it("Add to score with upvote", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );

    cy.intercept("POST", `http://localhost:5000/recommendations/1/upvote`).as(
      "addUpvote"
    );

    cy.wait("@getRecommendations");

    cy.get(`[data-test-id="upvote-1"]`).click();
    cy.wait("@addUpvote");

    cy.get('[data-test-id="score"]').should("contain.text", 1);
  });

  it("Subtract from score with downvote", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );

    cy.intercept("POST", `http://localhost:5000/recommendations/1/downvote`).as(
      "addDownvote"
    );

    cy.wait("@getRecommendations");

    cy.get(`[data-test-id="downvote-1"]`).click();
    cy.wait("@addDownvote");

    cy.get('[data-test-id="score"]').should("contain.text", -1);
  });

  it("Delete recommendation with low score", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );

    cy.intercept("POST", `http://localhost:5000/recommendations/1/downvote`).as(
      "addDownvote"
    );

    cy.wait("@getRecommendations");

    for (let i = 0; i < 6; i++) {
      cy.get(`[data-test-id="downvote-1"]`).click();
      cy.wait("@addDownvote");
    }

    cy.get('[data-test-id="1"]').should("not.exist");
  });
});
