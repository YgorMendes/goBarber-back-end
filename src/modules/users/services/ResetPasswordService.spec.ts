import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository, 
      fakeUserTokensRepository,
      fakeHashProvider,
    );

  })

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123132',
      token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123132');
    expect(updateUser?.password).toBe('123132');
  });

  it('should not be able yo reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing token',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able yo reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user'
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('Should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    })

    await expect(
      resetPassword.execute({
        password: '123132',
        token,
    })).rejects.toBeInstanceOf(AppError);
  })
});