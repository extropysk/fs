import { Injectable } from '@nestjs/common'
import { Payload } from 'src/core/interfaces/payload.interface'
import { User } from 'src/users/interfaces/user.interface'

@Injectable()
export class UsersService {
  getCurrentUser(current: Payload): User {
    return { id: current.sub, roles: current.roles }
  }
}
