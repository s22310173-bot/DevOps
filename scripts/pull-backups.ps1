param(
    [string]$Server = "103.139.192.112",
    [string]$User = "juiziy",
    [string]$KeyPath = (Join-Path $env:USERPROFILE ".ssh\id_ed25519_farmcare"),
    [string]$Dest = (Join-Path $env:USERPROFILE "FarmCare-Backups\from-vps"),
    [int]$RetentionDays = 30
)

# J3 - Salin backup FarmCare dari server ke mesin ini (off-site) via SSH key.
# Dijadwalkan lewat Task Scheduler agar berjalan harian.

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
$log = Join-Path (Split-Path $Dest -Parent) "pull.log"

$common = @("-i", $KeyPath, "-o", "StrictHostKeyChecking=accept-new", "-o", "BatchMode=yes", "-q")
& scp @common "${User}@${Server}:/backup/farmcare/farmcare-db-*.sql.gz" $Dest
& scp @common "${User}@${Server}:/backup/farmcare/farmcare-files-*.tar.gz" $Dest

$cutoff = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem -Path $Dest -File | Where-Object { $_.LastWriteTime -lt $cutoff } | Remove-Item -Force

$count = (Get-ChildItem -Path $Dest -File).Count
$line = "[{0}] pull off-site FarmCare selesai: {1} file di {2}" -f (Get-Date -Format s), $count, $Dest
Add-Content -Path $log -Value $line
Write-Output $line
