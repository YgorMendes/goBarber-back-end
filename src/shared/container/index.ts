import { container, delay } from 'tsyringe';

import {  } from '@modules/users/providers';

import IAppointmentsReposiory from '@modules/appointments/repositories/IAppointmentsRepository'
import AppointmentsReposiory from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentsReposiory>(
  'AppointmentsReposiory',
  delay(() => AppointmentsReposiory),
  
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository),
);
