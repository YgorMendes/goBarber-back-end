import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    
    createUser = new CreateUserService(
      fakeUsersRepository, 
      fakeHashProvider,
      fakeCacheProvider,
      );
      
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('Should be able to authenticate', async () => {
    const user = await createUser.execute({
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
    await expect(
      authenticateUser.execute({
        email: 'larry@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong pasword', async () => {
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