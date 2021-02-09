import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResestPasswordController from '../controllers/ResestPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resestPasswordController = new ResestPasswordController();

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resestPasswordController.create);

export default passwordRouter; 
