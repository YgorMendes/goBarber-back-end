import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository, 
      fakeMailProvider,
      fakeUserTokensRepository,
    );

  })

  it('Should be able to recover the password using the email', async () => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');


    await fakeUsersRepository .create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.execute({
      email: 'larry@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('shold not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'larry@gmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold generate a forgot password token', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository .create({
      name: 'Larry',
      email: 'larry@gmail.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.execute({
      email: 'larry@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});