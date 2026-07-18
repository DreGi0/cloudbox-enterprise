const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer.claims;
  const ownerId = claims.sub;
  const fileId = event.pathParameters.id;
  const body = JSON.parse(event.body || "{}");

  const existing = await docClient.send(new GetCommand({
    TableName: "Files",
    Key: { fileId }
  }));

  if (!existing.Item || existing.Item.ownerId !== ownerId) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Forbidden" })
    };
  }

  await docClient.send(new UpdateCommand({
    TableName: "Files",
    Key: { fileId },
    UpdateExpression: "set fileName = :fileName, category = :category, size = :size",
    ExpressionAttributeValues: {
      ":fileName": body.fileName ?? existing.Item.fileName,
      ":category": body.category ?? existing.Item.category,
      ":size": body.size ?? existing.Item.size
    }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "UpdateFile ejecutada correctamente" })
  };
};