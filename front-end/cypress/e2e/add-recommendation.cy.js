import { faker } from "@faker-js/faker";

describe('Test post on recommendations', () => {
  const string = faker.random.alpha(11);

  const recommendation = {
    name: faker.music.songName(),
    link: `https://youtu.be/${string}`
  }

  it('add name and link', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.link);
    cy.intercept('POST', 'http://localhost:5000/recommendations').as('newRecommendation');
    cy.get("button").click();
    cy.wait('@newRecommendation');
    cy.contains(recommendation.name).should('be.visible');
  })
})