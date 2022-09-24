import supertest from "supertest";

import app from "../src/app";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";
import recommendationListFactory from "./factories/recommendationListFactory";
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

describe("POST /recommendations/:id/downvote", () => {
    it("Should return status code 200 given downvote on existent recommendation", async () => {
        const recommendation = await recommendationFactory();

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send();

        expect(response.status).toBe(200);
    })

    it("Should return status code 200 given downvote on low-scoring recommendation", async () => {
        const recommendation = await recommendationFactory();

        await prisma.recommendation.update({
            where: { name: recommendation.name},
            data: {
                score: -5
            }
        });

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send();

        const findRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name }
        });

        expect(response.status).toBe(200);
        expect(findRecommendation).toBeNull();
    })

    it("Should return status code 404 given downvote on inexistent recommendation", async () => {
        const response = await supertest(app).post(`/recommendations/${0}/downvote`).send(); 

        expect(response.status).toBe(404)
    })
})

describe("GET /recommendations", () => {
    it("Should return status code 200 and recommendations list with 10 items", async () => {
        await recommendationListFactory();

        const response = await supertest(app).get(`/recommendations`);
        
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeLessThan(11);
    })
})

describe("GET /recommendations/:id", () => {
    it("Should return status code 200 and recommendation given valid id", async () => {
        const song = await recommendationFactory();

        const response = await supertest(app).get(`/recommendations/${song.id}`).send();
        
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    })

    it("Should return status code 404 given invalid id", async () => {
        const response = await supertest(app).get(`/recommendations/${0}`).send();
        
        expect(response.status).toBe(404);
    })
})

describe("GET /recommendations/random", () => {
    it("Should return status code 200 and recommendation given populated recommendations table", async () => {
        await recommendationListFactory();

        const response = await supertest(app).get("/recommendations/random");

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    })

    it("Should return status code 404 given empty recommendations table", async () => {
        const response = await supertest(app).get("/recommendations/random");

        expect(response.status).toBe(404);
    })
})

describe("GET /recommendations/top/:amount", () => {
    it("Should return status code 200 and recommendation list given valid amount", async () => {
        await recommendationListFactory();
        const amount = Math.floor(Math.random() * 10) + 1;

        const response = await supertest(app).get(`/recommendations/top/${amount}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.length).toBeLessThanOrEqual(amount);
    })

    it("Should return status code 500 given invalid amount", async () => {
        await recommendationListFactory();
        const amount = "string";

        const response = await supertest(app).get(`/recommendations/top/${amount}`);

        expect(response.status).toBe(500);
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});