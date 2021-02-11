import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(
      fakeUsersRepository,
    );
  });

  it('Should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });
    
    expect(profile.name).toBe('Larry');
    expect(profile.email).toBe('larry@gmail.com');
  });

  it('Should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});