import { faker } from "@faker-js/faker";

async function songFactory() {
  const fakerString = faker.random.alpha(11);

  return {
    name: faker.music.songName(),
    youtubeLink: `https://youtu.be/${fakerString}`,
  };
}

async function recommendationFactory() {
  const song = await songFactory();
  const id = faker.datatype.number();
  const score = faker.datatype.number({ min: -5 });

  return { id, name: song.name, youtubeLink: song.youtubeLink, score };
}

async function recommendationListFactory() {
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

export { songFactory, recommendationFactory, recommendationListFactory };
