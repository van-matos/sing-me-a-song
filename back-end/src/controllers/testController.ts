import { Request, Response } from "express";
import { testService } from "../services/testService.js";

async function resetDatabase(req: Request, res: Response) {
  await testService.reset();

  res.sendStatus(200);
}

async function seedDatabase(req: Request, res: Response) {
  await testService.seed();

  res.sendStatus(200);
}

export const testController = {
  resetDatabase,
  seedDatabase,
};
