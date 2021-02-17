import { getDate, getDaysInMonth } from "date-fns";
import "reflect-metadata";

import { injectable, inject } from 'tsyringe';
import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      }
    );

    return appointments
  }
}

export default ListProviderAppointmentsService;