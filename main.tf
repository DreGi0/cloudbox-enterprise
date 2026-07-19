# LABORATORIO 10 CI/CD
module "dynamodb" {
  source = "./modules/dynamodb"
}
module "cognito" {
  source = "./modules/cognito"
}
module "iam" {
  source             = "./modules/iam"
  sqs_queue_arn      = aws_sqs_queue.documents_queue.arn
  dynamodb_table_arn = module.dynamodb.table_arn
}
module "lambda" {
  source          = "./modules/lambda"
  lambda_role_arn = module.iam.lambda_role_arn
  queue_url       = aws_sqs_queue.documents_queue.id
}
module "apigateway" {
  source = "./modules/apigateway"

  create_file_invoke_arn    = module.lambda.create_file_invoke_arn
  get_files_invoke_arn      = module.lambda.get_files_invoke_arn
  get_file_by_id_invoke_arn = module.lambda.get_file_by_id_invoke_arn
  update_file_invoke_arn    = module.lambda.update_file_invoke_arn
  delete_file_invoke_arn    = module.lambda.delete_file_invoke_arn

  create_file_lambda_arn    = module.lambda.create_file_lambda_arn
  get_files_lambda_arn      = module.lambda.get_files_lambda_arn
  get_file_by_id_lambda_arn = module.lambda.get_file_by_id_lambda_arn
  update_file_lambda_arn    = module.lambda.update_file_lambda_arn
  delete_file_lambda_arn    = module.lambda.delete_file_lambda_arn

  cognito_user_pool_arn = module.cognito.user_pool_arn
}

module "frontend" {
  source = "./modules/frontend"

  project_name = var.project_name
  region       = var.aws_region
  api_url      = module.apigateway.api_url
  user_pool_id = module.cognito.user_pool_id
  client_id    = module.cognito.client_id
  api_key      = module.apigateway.api_key
}

