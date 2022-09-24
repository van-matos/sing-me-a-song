import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database";
import songFactory from "./songFactory";

export default async function recommendationFactory() {
    const song = await songFactory();

    await prisma.recommendation.create({
        data: {
            ...song,
            score: faker.datatype.number({ min: -5, max: 100})
        }
    });

    return await prisma.recommendation.findFirst({
        where: { name: song.name },
    });
}