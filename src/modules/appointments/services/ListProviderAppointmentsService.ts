import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
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
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
    const cachekay = `providers-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments =  await this.cacheProvider.recover<Appointment[]>(
      cachekay,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllDayFromProvider(
        {
          provider_id,
          day,
          month,
          year,
        },
      );

      await this.cacheProvider.save(
        cachekay,
        appointments
      );

      console.log('buscou no banco')
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;