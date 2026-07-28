# Creates .env.local with the OpenAI key for local development.
# Prompts for the key so it never appears in a command line or chat.
$ErrorActionPreference = 'Continue'
Set-Location (Join-Path $PSScriptRoot '..')

if (Test-Path .env.local) {
    Write-Host ".env.local already exists. Aborting so nothing is overwritten." -ForegroundColor Yellow
    Write-Host "Edit it by hand if the key needs to change."
    return
}

$key = Read-Host "Paste your OpenAI API key (input hidden)" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($key))
if ([string]::IsNullOrWhiteSpace($plain)) {
    Write-Host "No key entered. Aborting." -ForegroundColor Yellow
    return
}

"OPENAI_API_KEY=$plain" | Out-File .env.local -Encoding utf8
Write-Host ".env.local written. Run 'pnpm dev' to start the app." -ForegroundColor Green
