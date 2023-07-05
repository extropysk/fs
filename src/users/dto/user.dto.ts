import { User } from 'src/users/interfaces/user.interface'

export class UserDto implements User {
  id: string
  roles?: string[]
}
