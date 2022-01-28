export function authorize(authToken: string | undefined | null): string  {
  if (!authToken || !authToken.includes('Bearer blarg-' )) {
    throw new Error('Unauthorized user')
  }
  return authToken.split('-')[1]
}
