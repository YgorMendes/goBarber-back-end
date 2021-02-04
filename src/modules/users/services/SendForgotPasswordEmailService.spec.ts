// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

describe('SendForgotPasswordEmail', () => {
  it('Should be able to recover the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository, fakeMailProvider
    );

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
});