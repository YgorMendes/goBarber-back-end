import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Mel',
      email: 'Mel@gmail.com',
    });
    
    expect(updateUser.name).toBe('Mel');
    expect(updateUser.email).toBe('Mel@gmail.com');
  });

  it('Should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Larry',
        email: 'larry@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Mel',
      email: 'Mel@gmail.com',
      old_password: '123456',
      password: '123456',
    });
    
    expect(updateUser.password).toBe('123456');
  });

  it('Should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });
    
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Mel',
        email: 'Mel@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });
    
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Mel',
        email: 'Mel@gmail.com',
        old_password: 'wroong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});