# backup_brain.ps1
# Backs up essential Antigravity brain data to brain_backup/ inside the project.
# Run this anytime to update the backup. Safe to commit to git.

$source = "C:\Users\muef2246\.gemini\antigravity\brain"
$dest   = "D:\tinygames\brain_backup"

Write-Host "Starting brain backup..." -ForegroundColor Cyan

# Clean old backup
if (Test-Path $dest) {
    Remove-Item -Path $dest -Recurse -Force
}
New-Item -ItemType Directory -Path $dest | Out-Null

# For each conversation folder, copy only the lightweight transcript.jsonl (not full logs or task files)
$conversations = Get-ChildItem -Path $source -Directory
$count = 0

foreach ($conv in $conversations) {
    $transcriptPath = "$($conv.FullName)\.system_generated\logs\transcript.jsonl"
    $destConvDir    = "$dest\$($conv.Name)\.system_generated\logs"

    if (Test-Path $transcriptPath) {
        # Skip corrupted/empty files (null bytes only)
        $content = Get-Content $transcriptPath -TotalCount 1 -ErrorAction SilentlyContinue
        if ($content -and $content.Trim().Length -gt 0) {
            New-Item -ItemType Directory -Path $destConvDir -Force | Out-Null
            Copy-Item -Path $transcriptPath -Destination "$destConvDir\transcript.jsonl" -Force
            $count++
        }
    }
}

Write-Host "Backed up $count conversations." -ForegroundColor Green

# Write a restore_info.txt so you know how to restore on a new device
$restoreInfo = @"
=== Antigravity Brain Backup ===
Backed up: $(Get-Date)
Conversations: $count
Source machine user: muef2246

HOW TO RESTORE ON A NEW DEVICE:
1. Install Antigravity extension
2. Copy contents of this brain_backup/ folder to:
   C:\Users\<your-username>\.gemini\antigravity\brain\
3. Restart your editor
4. All past conversations will be accessible via @mention

NOTE: Only transcript.jsonl files are backed up (not task logs or artifacts).
Full conversation history is preserved but task outputs may be missing.
"@

$restoreInfo | Out-File -FilePath "$dest\RESTORE_INFO.txt" -Encoding UTF8

$sizeMB = [math]::Round((Get-ChildItem $dest -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
Write-Host "Backup complete! Size: $sizeMB MB -> D:\tinygames\brain_backup\" -ForegroundColor Green
Write-Host "Run 'git add brain_backup/ && git commit -m backup && git push' to save to GitHub." -ForegroundColor Yellow
