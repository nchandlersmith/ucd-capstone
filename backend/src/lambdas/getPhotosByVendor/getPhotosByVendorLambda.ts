import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export const handler = async  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const vendor = event.pathParameters?.vendorName
  return {
    statusCode: 200,
    body: `{pathParams: ${vendor}}`
  }
}

