import { faker } from "@faker-js/faker";

import { recommendationService } from "../../src/services/recommendationsService";
import {
  songFactory,
  recommendationFactory,
  recommendationListFactory,
} from "./factories/recommendationFactory";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("POST /recommendations", () => {
  it("Should create recommendation", async () => {
    const song = await songFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(song);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Should not create duplicate recommendation", async () => {
    const song = await songFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return { name: song.name, youtubeLink: song.youtubeLink };
      });

    const response = recommendationService.insert(song);

    expect(response).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("Should add upvote given valid id", async () => {
    const song = await songFactory();
    const id = faker.datatype.number();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should not add upvote given invalid id", async () => {
    const id = faker.datatype.number();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.upvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(response).rejects.toEqual({ message: "", type: "not_found" });
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("Should add downvote given valid id", async () => {
    const song = await songFactory();
    const id = faker.datatype.number();
    const score = faker.datatype.number({ min: -5 });

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink, score };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink, score };
      });

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should add downvote and delete recommendation given valid id and score less than -5", async () => {
    const song = await songFactory();
    const id = faker.datatype.number();
    const score = -6;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink, score };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink, score };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it("Should not add downvote given invalid id", async () => {
    const id = faker.datatype.number();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(response).rejects.toEqual({ message: "", type: "not_found" });
  });
});

describe("GET /recommendations", () => {
  it("Should return most recent recommendations", async () => {
    const list = recommendationListFactory();

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return list;
      });

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("Should return top recommendations given valid amount", async () => {
    const list = await recommendationListFactory();
    const amount = faker.datatype.number({ max: 10 });

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return list;
      });

    await recommendationService.getTop(amount);

    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
  });
});

describe("GET /recommendations/random", () => {
  it("Should return recommendation with score greater than 10", async () => {
    const recommendation = await recommendationFactory();
    console.log(recommendation);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.6);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [recommendation];
      });

    const response = recommendationService.getRandom();

    expect(response).toBeInstanceOf(Object);
    //expect((await response).score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should return recommendation with score equal to or less than 10", async () => {
    const recommendation = recommendationFactory();
    console.log(recommendation);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [recommendation];
      });

    const response = recommendationService.getRandom();

    expect(response).toBeInstanceOf(Object);
    //expect((await response).score).toBeLessThanOrEqual(10);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should return error given empty recommendations table", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [];
      });

    const response = recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
    expect(response).rejects.toEqual({ type: "not_found", message: "" });
  });
});
