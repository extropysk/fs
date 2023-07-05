import { Payload } from 'src/core/interfaces/payload.interface'
import { User } from 'src/users/interfaces/user.interface'

export class UsersService {
  getCurrentUser(current: Payload): User {
    return { id: current.sub, roles: current.roles }
  }
}
