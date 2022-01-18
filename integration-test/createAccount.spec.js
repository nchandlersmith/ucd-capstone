const axios = require('axios')

describe('create account', () => {
    it('should create an account', async () => {
        const url = 'http://localhost:3000/dev/accounts'
        const createAccountData = {
            'accountType': 'Integration Test Account',
            'initialDeposit': 3145
        }

        const result = await axios.post(url, createAccountData)
        console.log(`result ${JSON.stringify(result.data)}`)

        expect(result.status).toEqual(201)
        expect(result.data.accountId).not.toBeNull()
        expect(result.data.accountType).toEqual('Integration Test Account')
        expect(result.data.createdAt).not.toBeNull()
    })
})