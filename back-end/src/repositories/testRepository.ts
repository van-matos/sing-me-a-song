import { prisma } from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

async function resetDatabase() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
}

async function seed(seedRecommendationData: CreateRecommendationData) {
  await prisma.recommendation.createMany({
    data: seedRecommendationData,
    skipDuplicates: true,
  });
}

export const testRepository = {
  resetDatabase,
  seed,
};
