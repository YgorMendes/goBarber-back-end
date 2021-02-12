import User from '../infra/typeorm/entities/User';
import ICreateDTO from '../dtos/IcreateUserDto';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateDTO): Promise<User>;
  save(user: User): Promise<User>;
}