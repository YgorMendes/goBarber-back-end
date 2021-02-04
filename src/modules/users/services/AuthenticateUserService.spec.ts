import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('Should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
        fakeUsersRepository, 
        fakeHashProvider
      );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const   user = await createUser.execute({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const  response = await authenticateUser.execute({
      email: 'larry@gmail.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await expect(
      authenticateUser.execute({
        email: 'larry@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong pasword', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
        fakeUsersRepository, 
        fakeHashProvider
      );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    await expect(
      authenticateUser.execute({
        email: 'larry@gmail.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});