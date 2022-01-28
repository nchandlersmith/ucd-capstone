import {AuthError} from "../exceptions/exceptions";

export function authorize(authToken: string | undefined | null): string  {
  if (!authToken || !authToken.includes('Bearer blarg-' )) {
    throw new AuthError('Unauthorized user')
  }
  return authToken.split('-')[1]
}
