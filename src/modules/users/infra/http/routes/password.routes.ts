import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResestPasswordController from '../controllers/ResestPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resestPasswordController = new ResestPasswordController();

passwordRouter.post(
  '/forgot', 
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
);

passwordRouter.post(
  '/reset', 
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resestPasswordController.create
);

export default passwordRouter; 
4