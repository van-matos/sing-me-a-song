import { prisma } from "../../src/database";
import songFactory from "./songFactory";

export default async function recommendationFactory() {
    const song = await songFactory();

    await prisma.recommendation.create({
        data: {
            ...song
        }
    });

    return await prisma.recommendation.findFirst({
        where: { name: song.name }
    });
}