const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { v4: uuidv4 } = require("uuid");

const sqs = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const claims = event.requestContext.authorizer.claims;
  const ownerId = claims.sub;

  if (!body.fileName || body.fileName.trim() === "") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "fileName es requerido" })
    };
  }

  if (typeof body.size !== "number" || body.size < 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "size debe ser un número positivo" })
    };
  }

  if (!body.category || body.category.trim() === "") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "category es requerido" })
    };
  }

  const file = {
    fileId: uuidv4(),
    ownerId: ownerId,
    fileName: body.fileName,
    category: body.category,
    size: body.size,
    status: "ACTIVE",
    uploadDate: new Date().toISOString()
  };

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(file)
    })
  );

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Message queued" })
  };
};