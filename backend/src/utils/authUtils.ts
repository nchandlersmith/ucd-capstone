export function authorize(authToken: string): string  {
  if (!authToken.includes('Bearer blarg-' )) {
    throw new Error('Unauthorized user')
  }
  return authToken.split('-')[1]
}
