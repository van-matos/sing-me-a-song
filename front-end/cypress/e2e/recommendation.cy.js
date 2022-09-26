import { faker } from "@faker-js/faker";

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

describe("Test recommendation posting", () => {
  it("Post new recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");

    cy.intercept("get", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );
    cy.wait("@getRecommendations");

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);

    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );
    cy.get('[data-test-id="submitButton"]').click();

    cy.wait("@postRecommendation");
    cy.wait("@getRecommendations");

    cy.get("article").should("have.length", 2);
  });

  it("Post repeated recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");

    cy.intercept("get", "http://localhost:5000/recommendations").as(
      "getRecommendations"
    );
    cy.wait("@getRecommendations");

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );
    cy.get('[data-test-id="submitButton"]').click();

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.get('[data-test-id="submitButton"]').click();

    cy.wait("@postRecommendation");
    cy.wait("@getRecommendations");

    cy.get("article").should("have.length", 2);
  });
});
