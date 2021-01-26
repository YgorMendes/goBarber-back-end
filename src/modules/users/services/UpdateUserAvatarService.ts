import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import IUsersRepositories from '../repositories/IUsersRepositories';

import User from '../infra/typeorm/entities/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

interface UserInterface {
  name: string;
  email: string;
  password?: string;
}

class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepositories) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<UserInterface> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }
      
    user.avatar = avatarFilename; 
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;