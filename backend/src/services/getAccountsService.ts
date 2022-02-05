import {CapstoneAccount} from "../models/getAccountsModels";
import {getAccountsByUser} from "../persistence/dbClient";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export async function getUserAccounts(user: string): Promise<CapstoneAccount[]> {
  const stub: DocumentClient.QueryOutput = await getAccountsByUser(user)
  return stub.Items as CapstoneAccount[]
}
