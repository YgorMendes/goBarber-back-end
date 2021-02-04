import "reflect-metadata";

import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from "@shared/errors/AppError";
import IUserTokennsRepository from "../repositories/IUserTokenRepository";

interface IRequest {
  email: string;
} 

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokennsRepository,
  ) {}

  public async execute({email}: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError('User does not exist');
    }

    await this.userTokenRepository.generate(user.id);

    this.mailProvider.sendMail( 
      email, 
      'Pedido de recuperação de senha recebido.'
    );
  }

}

export default SendForgotPasswordEmailService;