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

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => {});

        await recommendationService.insert(song);
        expect(recommendationRepository.create).toBeCalled();
    })

    it("Should not create duplicate recommendation", async () => {
        const song = await songFactory();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
            return { name: song.name, youtubeLink: song.youtubeLink };
        })

        const response = recommendationService.insert(song);

        expect(response).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict"
        });
        expect(recommendationRepository.create).not.toBeCalled();
    })
})