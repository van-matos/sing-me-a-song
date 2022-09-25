import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database";

async function songFactory() {
  const fakerString = faker.random.alpha(11);

  return {
    name: faker.music.songName(),
    youtubeLink: `https://youtu.be/${fakerString}`,
  };
}

async function recommendationFactory() {
  const song = await songFactory();

  await prisma.recommendation.create({
    data: {
      ...song,
      score: faker.datatype.number({ min: -5, max: 100 }),
    },
  });

  return await prisma.recommendation.findFirst({
    where: { name: song.name },
  });
}

async function recommendationListFactory() {
  let counter = 0;

  while (counter < 15) {
    await recommendationFactory();
    counter++;
  }

  return;
}

async function recommendationListFactoryUnit() {
  let counter = 0;
  let list = [];

  const song = await songFactory();

  while (counter < 15) {
    const recommendation = {
      ...song,
      id: counter + 1,
      score: faker.datatype.number({ min: -5, max: 100 }),
    };

    list.push(recommendation);
    counter++;
  }

  return;
}

export {
  songFactory,
  recommendationFactory,
  recommendationListFactory,
  recommendationListFactoryUnit,
};
