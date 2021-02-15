import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
    );
  });

  it('Should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Mel',
      email: 'mel@gmail.com',
      password: '123456'
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Ygor',
      email: 'Ygor@gmail.com',
      password: '123456'
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    })
    
    expect(providers).toEqual([user1, user2]);
  });
});