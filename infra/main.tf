# Hosting for the portfolio: one Cloudflare Pages project (Direct Upload).
# Terraform runs in GitHub Actions (.github/workflows/site.yml); state lives in HCP Terraform.
# The site files themselves are uploaded by wrangler in the same workflow.

terraform {
  required_version = ">= 1.6"

  # Organization comes from the TF_CLOUD_ORGANIZATION environment variable (a GitHub Actions variable).
  cloud {
    workspaces {
      name = "portfolio"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Reads the API token from the CLOUDFLARE_API_TOKEN environment variable.
provider "cloudflare" {}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (passed in as TF_VAR_cloudflare_account_id)."
  type        = string
}

variable "project_name" {
  description = "Pages project name; the site is served at <project_name>.pages.dev."
  type        = string
  default     = "lukepetzer"
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"
}

output "pages_subdomain" {
  description = "The *.pages.dev address Cloudflare assigned."
  value       = cloudflare_pages_project.site.subdomain
}
