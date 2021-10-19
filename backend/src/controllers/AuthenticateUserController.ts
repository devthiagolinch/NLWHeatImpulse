import { Request, Response } from "express";
import { AuthenticationUserService } from "../services/AuthenticateUserService";

class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;

    const service = new AuthenticationUserService();
    try {
      const result = await service.execute(code)
      return res.json(result)
    } catch (err) {
      return res.json(err.message);
    }

  }
}

export { AuthenticateUserController }