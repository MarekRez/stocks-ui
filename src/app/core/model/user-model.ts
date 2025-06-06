import {UserRoleEnum} from './user-role-enum';

export interface UserModel {
  id: number;
  name: string;
  role: UserRoleEnum;
  email: string;
}
