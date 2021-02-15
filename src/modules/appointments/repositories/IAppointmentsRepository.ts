import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllMonthFromProviderDTO from '../dtos/IFindAllMonthFromProviderDTO';
import IFindAllDayFromProviderDTO from '../dtos/IFindAllDayFromProviderDTO';


export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise< Appointment | undefined>;
  findAllMonthFromProvider(date: IFindAllMonthFromProviderDTO): Promise<Appointment[]>;
  findAllDayFromProvider(date: IFindAllDayFromProviderDTO): Promise<Appointment[]>;
}