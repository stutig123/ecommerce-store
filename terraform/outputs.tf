output "public_ip" {
  value = aws_instance.ecommerce_server.public_ip
}

output "instance_id" {
  value = aws_instance.ecommerce_server.id
}
