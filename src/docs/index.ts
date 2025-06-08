
import { authSwagger } from './auth-swagger';
import { usersSwagger } from './users-swagger';

export const paths = {
  ...authSwagger,
  ...usersSwagger,
};
