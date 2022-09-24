import supertest from "supertest";

import app from "../src/app";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";
import songFactory from "./factories/songFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("POST /recommendations", () => {
    it("Should return status code 201 given a valid body", async () => {
        const song = await songFactory();

        const response = await supertest(app).post(`/recommendations`).send(song);

        const findSong = await prisma.recommendation.findFirst({
            where: { name: song.name },
          });

        expect(response.status).toBe(201);
        expect(findSong).toBeInstanceOf(Object);
    })

    it("Should return status code 409 given a repeated recommendation", async () => {
        const song = await songFactory();

        await supertest(app).post(`/recommendations`).send(song);
        
        const response = await supertest(app).post(`/recommendations`).send(song);

        expect(response.status).toBe(409);
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

describe("POST /recommendations/:id/upvote", () => {
    it("Should return status code 200 given upvote on existent recommendation", async () => {
        const recommendation = await recommendationFactory();

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`).send();

        expect(response.status).toBe(200);
    })

    it("Should return status code 404 given upvote on inexistent recommendation", async () => {
        const response = await supertest(app).post(`/recommendations/${0}/upvote`).send(); 

        expect(response.status).toBe(404)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});