import { faker } from "@faker-js/faker";
import { testRepository } from "../repositories/testRepository.js";

async function reset() {
  await testRepository.resetDatabase();
}

async function seed() {
  const seedRecommendationData = [];

  for (let i = 0; i < 15; i++) {
    seedRecommendationData.push({
      name: faker.music.songName(),
      youtubeLink: `https://youtu.be/${faker.random.alpha(11)}`,
      score: faker.datatype.number({ min: -5, max: 100 }),
    });
  }

  for (let recommendation of seedRecommendationData) {
    await testRepository.seed(recommendation);
  }
}

async function seedOne() {
  const seedRecommendationData = [];
  const seedRecommendationQuantity = 1;

  for (let i = 0; i < seedRecommendationQuantity; i++) {
    seedRecommendationData.push({
      name: faker.music.songName(),
      youtubeLink: `https://youtu.be/${faker.random.alpha(11)}`,
      score: 0,
    });
  }

  for (let recommendation of seedRecommendationData) {
    await testRepository.seed(recommendation);
  }
}

export const testService = {
  reset,
  seed,
  seedOne,
};
