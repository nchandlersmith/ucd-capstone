import {authorize} from "./authUtils";

describe('authorize', () => {
  // For now, user is simply being plucked off the token after the '-'
  it('should return userId', () => {
    const expectedUser = 'Authorized User'
    const authToken = `Bearer blarg-${expectedUser}`

    const user = authorize(authToken)

    expect(user).toEqual(expectedUser)
  })

  it('should accept Bearer token', () => {
    const authToken = ''
    expect(() => authorize(authToken)).toThrow(/^Unauthorized user$/)
  })

  it('should pass verification', () => {
    // For now, verification is simply blarg-user. This test checks for blarg-
    const authToken = 'Bearer user'
    expect(() => authorize(authToken)).toThrow(/^Unauthorized user$/)
  })

  it('should refuse missing auth header', () => {
    expect(() => authorize(undefined)).toThrow(/^Unauthorized user$/)
  })

  it('should refuse null auth header', () => {
    expect(() => authorize(null)).toThrow(/^Unauthorized user$/)
  })
})
