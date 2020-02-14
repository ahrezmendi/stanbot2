terraform {
  backend "s3" {
    bucket = "terraform-state-nsaw"
    key    = "discord-bot"
    region = "us-east-1"
  }
}
