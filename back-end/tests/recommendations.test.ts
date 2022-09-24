import supertest from "supertest";

import app from "../src/app";
import { prisma } from "../src/database";
import songFactory from "./factories/recommendationFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("POST /recommendations", () => {
    it("Should return status code 201 given a valid body", async () => {
        const song = await songFactory();

        const response = await supertest(app).post(`/recommendations`).send(song);

        const createdMusic = await prisma.recommendation.findFirst({
            where: { name: song.name },
          });

        expect(response.status).toBe(201);
        expect(createdMusic).toBeInstanceOf(Object);
    })

    it("Should return status code 422 given a body with no name", async () => {
        const song = await songFactory();
        song.name = "";

        const response = await supertest(app).post(`/recommendations`).send(song);

        expect(response.status).toBe(422);
    })

    it("Should return status code 422 given a body with no YouTube link", async () => {
        const song = await songFactory();
        song.youtubeLink = "";

        const response = await supertest(app).post(`/recommendations`).send(song);

        expect(response.status).toBe(422);
    })

    it("Should return status code 422 given an empty body", async () => {
        const song = {};

        const response = await supertest(app).post(`/recommendations`).send(song);

        expect(response.status).toBe(422);
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});