variable "instance_type" {
  default = "t2.micro"
}

variable "ami_id" {
  default = "ami-03bb6d83c60fc5f7c" # Amazon Linux 2 in ap-south-1
}

variable "key_name" {
  default = "stuti-key" # Ensure this key exists in your AWS console
}
