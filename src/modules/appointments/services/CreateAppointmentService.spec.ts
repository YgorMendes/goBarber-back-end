import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it('Should be able to create a new appointment', async () => {
    const  appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
      user_id: '123987'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    

    const appointmentDate = new Date(2021, 1, 31, 15);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '123987'
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: '123987'
      }),
    ).rejects.toBeInstanceOf(AppError);
  }); 
});