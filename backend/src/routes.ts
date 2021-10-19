import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { GetLast3MessagesController } from './controllers/GetLast3MessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';

const authenticateUserController = new AuthenticateUserController();
const createMessageController = new CreateMessageController();
const getLast3MessagesController = new GetLast3MessagesController();
const getUserProfileController = new ProfileUserController();

const router = Router();

router.post('/authenticate', authenticateUserController.handle);

router.post('/messages', ensureAuthenticated, createMessageController.handle);

router.get('/messages/last3', getLast3MessagesController.handle);

router.get('/profile', ensureAuthenticated, getUserProfileController.handle);

export { router }