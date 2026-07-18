output "create_file_lambda_arn" { 
 value = aws_lambda_function.create_file.arn 
} 
output "get_files_lambda_arn" {
  value = aws_lambda_function.get_files.arn
}

output "get_file_by_id_lambda_arn" {
  value = aws_lambda_function.get_file_by_id.arn
}

output "update_file_lambda_arn" {
  value = aws_lambda_function.update_file.arn
}

output "delete_file_lambda_arn" {
  value = aws_lambda_function.delete_file.arn
}
output "create_file_invoke_arn" {
  value = aws_lambda_function.create_file.invoke_arn
}

output "get_files_invoke_arn" {
  value = aws_lambda_function.get_files.invoke_arn
}

output "get_file_by_id_invoke_arn" {
  value = aws_lambda_function.get_file_by_id.invoke_arn
}

output "update_file_invoke_arn" {
  value = aws_lambda_function.update_file.invoke_arn
}

output "delete_file_invoke_arn" {
  value = aws_lambda_function.delete_file.invoke_arn
}