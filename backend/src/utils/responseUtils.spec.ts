import { responseBuilder} from "./responseUtils";

describe('responseBuilder', () => {
  const statusCode = 200
  const requiredHeaders = {
    'access-control-allow-origin': '*'
  }
  const body = {message: 'Success'}
  it('should return a status code', () => {
    const result = responseBuilder(statusCode, body)
    expect(result.statusCode).toEqual(statusCode)
  })

  it('should return required headers', () => {
    const result = responseBuilder(statusCode, body)
    expect(result.headers).toEqual(requiredHeaders)
  })

  it('should return a body', () => {
    const expectedBody = JSON.stringify(body)
    const result = responseBuilder(statusCode, body)
    expect(result.body).toEqual(expectedBody)
  })
})
