import { Request, Response } from "express";
import { ProfileuserService } from "../services/ProfileUserService";

class ProfileUserController {
  async handle(req: Request, res: Response) {
    const { user_id } = req;

    const service = new ProfileuserService();

    const result = await service.execute(user_id)

    res.json(result);
  }
}

export { ProfileUserController };