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

  it("Post recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");
    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").click();
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
    cy.get("button").click();
    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtubeLink"]').type(youtubeLink);
    cy.get("button").click();
    cy.wait("@postRecommendation").then((interception) => {
      const status = interception.response.statusCode;
      expect(status).eq(409);
    });
  });
});
