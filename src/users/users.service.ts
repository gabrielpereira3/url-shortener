import {Injectable} from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@email.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'chris@email.com',
      password: 'secret',
    },
  ];

  async findOne(email: string): Promise<any | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create(user: User) {
    this.users.push(user);
  }
}
