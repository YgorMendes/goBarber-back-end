import { uuid } from 'uuidv4';
import { getMonth, getYear, isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindAllMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllMonthFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date),
    )

    return findAppointment;
  }

  public async findAllMonthFromProvider({ provider_id, year, month }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) +1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {id: uuid(), date, provider_id});

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
