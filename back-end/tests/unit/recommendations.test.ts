import { faker } from "@faker-js/faker";

import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { songFactory } from "../factories/recommendationFactory";

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
    const id = faker.datatype.number({ min: 0, precision: 1 });

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { id, name: song.name, youtubeLink: song.youtubeLink };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should not add upvote given invalid id", async () => {
    const id = faker.datatype.number({ min: 0, precision: 1 });

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.upvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(response).rejects.toEqual({ message: "", type: "not_found" });
  });
});
