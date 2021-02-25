import AppError from '@shared/errors/AppError';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 10, 11).getTime();
    });

    const  appointment = await createAppointment.execute({
      date: new Date(2021, 1, 10, 12),
      provider_id: 'provider_id',
      user_id: 'user_id'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 1, 31, 15);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointments on the past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 10, 11).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 10, 10),
        provider_id: 'provider_id',
        user_id: 'user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 10, 13),
        provider_id: 'user_id',
        user_id: 'user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 10, 13),
        provider_id: 'user_id',
        user_id: 'user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  }); 

  it('Should not be able to create an appointments before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 11, 7),
        provider_id: 'provider_id',
        user_id: 'user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
    
    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 11, 18),
        provider_id: 'provider_id',
        user_id: 'user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  }); 
});