import { container, delay } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentsReposiory from '@modules/appointments/repositories/IAppointmentsRepository'
import AppointmentsReposiory from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IAppointmentsReposiory>(
  'AppointmentsReposiory',
  delay(() => AppointmentsReposiory), 
  
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository),
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  delay(() => UserTokensRepository),
);
