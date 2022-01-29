import {errorResponseBuilder, responseBuilder} from "./responseUtils";

describe('responseUtils', () => {
  const requiredHeaders = {
    'access-control-allow-origin': '*'
  }

  describe('responseBuilder', () => {
    const statusCode = 200
    const body = {message: 'Success'}

    it('should return a status code', () => {
      const result = responseBuilder(statusCode, body)
      expect(result.statusCode).toEqual(statusCode)
    })

    it('should return required headers', () => {
      const result = responseBuilder(statusCode, body)
      expect(result.headers).toStrictEqual(requiredHeaders)
    })

    it('should return a body', () => {
      const expectedBody = JSON.stringify(body)
      const result = responseBuilder(statusCode, body)
      expect(result.body).toEqual(expectedBody)
    })
  })

  describe('errorResponseBuilder', () => {
    describe('input string', () => {
      const error = 'some error string'

      it('should return statusCode 500', () => {
        const result = errorResponseBuilder(error)
        expect(result.statusCode).toEqual(500)
      })

      it('should return required headers', () => {
        const result = errorResponseBuilder(error)
        expect(result.headers).toStrictEqual(requiredHeaders)
      })

      it('should return body', () => {
        const expectedBody = JSON.stringify({error})
        const result = errorResponseBuilder(error)
        expect(result.body).toEqual(expectedBody)
      })
    })

    describe('input Error', () => {
      const error = new Error('some error message')

      it('should return statusCode 500', () => {
        const result = errorResponseBuilder(error)
        expect(result.statusCode).toEqual(500)
      })

      it('should return required headers', () => {
        const result =  errorResponseBuilder(error)
        expect(result.headers).toStrictEqual(requiredHeaders)
      })

      it('should return body', () => {
        const expectedBody = JSON.stringify({error: error.message})
        const result = errorResponseBuilder(error)
        expect(result.body).toEqual(expectedBody)
      })
    });
  })
});
