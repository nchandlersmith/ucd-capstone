import axios from 'axios'
import {createDocumentClient} from '../utils/dynamoUtils';
import { CapstoneAccount } from '../../backend/src/models/getAccountsModels'

const userId = 'Ghost Rider'
const tableName = 'Accounts-dev'
const accountsUrl = 'http://localhost:3000/dev/accounts'

describe('get account ', () => {
  it('should get all accounts for the specific user', async () => {
    const headers = {Authorization: `Bearer blarg-${userId}`}
    const userAccount: CapstoneAccount = {
      userId,
      accountId: '1234-abc-890-xyz',
      accountType: 'Integrated Savings',
      balance: 1200,
      createdOn: 'some day'
    }
    const alienAccount: CapstoneAccount = {
      userId: 'Space Guy',
      accountId: '1111-aaa-222-bbb',
      accountType: 'Space Savings',
      balance: 24000,
      createdOn: 'ancient times'
    }
    await putAccountInDynamo(userAccount);
    await putAccountInDynamo(alienAccount);

    const result = await axios.get(accountsUrl, {headers})

    await deleteAllAccountsByAccountIdForUserId(userAccount.accountId, userAccount.userId)
    await deleteAllAccountsByAccountIdForUserId(alienAccount.accountId, alienAccount.userId)
    expect(result.status).toEqual(200)
    expect(result.data.accounts.length).toEqual(1)
    expect(result.data.accounts[0]).toStrictEqual(userAccount)
  })
});

function putAccountInDynamo(account: CapstoneAccount) {
  createDocumentClient().put({TableName: tableName, Item: account}).promise()
}

function deleteAllAccountsByAccountIdForUserId(accountId: string, userId: string) {
  return createDocumentClient().delete({
    TableName: tableName,
    Key: {
      "userId": userId,
      "accountId": accountId
    }
  }).promise()
}
