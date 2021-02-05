import "reflect-metadata";

import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import AppError from "@shared/errors/AppError";
import IUserTokensRepository from "../repositories/IUserTokenRepository";
import IHasProvider from "../providers/HasProvider/models/IHashProvider";
import { addHours, isAfter } from "date-fns";

interface IRequest {
  token: string;
  password: string;
} 

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHasProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('User token does not exist');
    }
    
    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user) {
      throw new AppError('User does not exist');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours( tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)){
      throw new AppError('token expired');
    }

    user.password =  await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;