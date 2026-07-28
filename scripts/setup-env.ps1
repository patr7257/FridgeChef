# Adds OPENAI_API_KEY to .env.local for local development.
# Prompts for the key so it never appears in a command line or chat.
$ErrorActionPreference = 'Continue'
Set-Location (Join-Path $PSScriptRoot '..')

if ((Test-Path .env.local) -and (Select-String -Path .env.local -Pattern '^OPENAI_API_KEY=' -Quiet)) {
    Write-Host "OPENAI_API_KEY is already set in .env.local. Aborting so nothing is overwritten." -ForegroundColor Yellow
    Write-Host "Edit .env.local by hand if the key needs to change."
    return
}

$key = Read-Host "Paste your OpenAI API key (input hidden)" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($key))
if ([string]::IsNullOrWhiteSpace($plain)) {
    Write-Host "No key entered. Aborting." -ForegroundColor Yellow
    return
}

Add-Content .env.local "OPENAI_API_KEY=$plain" -Encoding utf8
Write-Host "OPENAI_API_KEY added to .env.local. Run 'pnpm dev' to start the app." -ForegroundColor Green
