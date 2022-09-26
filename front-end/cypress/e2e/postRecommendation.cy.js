import { faker } from "@faker-js/faker";

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

describe("Post recommendation", () => {
  it("Post new recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");
    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get('[data-test-id="submitButton"]').click();
    cy.wait("@postRecommendation").then((interception) => {
      const status = interception.response.statusCode;
      expect(status).eq(201);
    });
  });

  it("Post repeated recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");
    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.get('[data-test-id="submitButton"]').click();
    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.get('[data-test-id="submitButton"]').click();
    cy.wait("@postRecommendation").then((interception) => {
      const status = interception.response.statusCode;
      expect(status).eq(409);
    });
  });
});
