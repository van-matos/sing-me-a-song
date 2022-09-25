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
    cy.wait("@getRecommendations");
    cy.get("article").should("have.length.of.at.most", 10);
  });

  it("Post recommendation", () => {
    const name = faker.music.songName();
    const youtubeLink = `https://youtu.be/${faker.random.alpha(11)}`;

    cy.visit("http://localhost:3000");
    cy.get('input[placeholder="Name"]').type(name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(youtubeLink);
    cy.intercept("POST", "/recommendations").as("createRecommendation");
    cy.get("button").click();
    cy.wait("@createRecommendation");
    cy.contains(name).should("be.visible");
  });
});
