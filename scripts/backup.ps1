# ==============================================================================
# HE THONG BACKUP TU DONG XOAY VONG (QUY CHUAN 5 BAN / 3 NGAY)
# DU AN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
# CHU SO HUU: SirPhuong (ptphuong0312@gmail.com)
# ==============================================================================

[CmdletBinding()]
param(
    [string]$ProjectName = "AutoCut_EDM_Expert",
    [switch]$DryRun = $false
)

# Thiet lap UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Xac dinh thu muc goc du an va thu muc backups
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($scriptDir -match 'scripts$') {
    $rootDir = Split-Path -Parent $scriptDir
} else {
    $rootDir = $scriptDir
}
$backupDir = Join-Path $rootDir "backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   BACKUP XOAY VONG 5 BAN / 3 NGAY - AUTOCUT SERVO EDM EXPERT" -ForegroundColor Cyan
Write-Host "   Chu so huu : SirPhuong" -ForegroundColor Cyan
Write-Host "   Thu muc goc: $rootDir" -ForegroundColor DarkGray
Write-Host "   Thu muc luu: $backupDir" -ForegroundColor DarkGray
Write-Host "==============================================================================" -ForegroundColor Cyan

# 2. Quy cach dat ten file backup moi
$now = Get-Date
$timestamp = $now.ToString("yyyyMMdd_HHmmss")
$newZipName = "BACKUP_" + $ProjectName + "_" + $timestamp + ".zip"
$newZipPath = Join-Path $backupDir $newZipName

Write-Host "`n[BUOC 1/2] DANG NEN DU LIEU DU AN THANH: $newZipName ..." -ForegroundColor Yellow

# Danh sach thu muc va dinh dang loai tru tuyet doi
$excludeDirs = @('backups', '.git', 'node_modules', '__pycache__', '.venv', '.vercel')
$excludeExts = @('.zip')

# Thu thap danh sach file hop le
$allFiles = Get-ChildItem -Path $rootDir -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($rootDir.Length + 1)
    $parts = $rel.Split([System.IO.Path]::DirectorySeparatorChar)
    $skip = $false
    
    if ($parts.Length -gt 1) {
        foreach ($p in $parts[0..($parts.Length - 2)]) {
            if ($excludeDirs -contains $p) {
                $skip = $true
                break
            }
        }
    }
    
    if ($excludeExts -contains $_.Extension.ToLower()) {
        $skip = $true
    }
    
    -not $skip
}

Write-Host "   * Tim thay $($allFiles.Count) tep tin hop le can nen (Da loai tru backups, .git, node_modules, *.zip...)." -ForegroundColor Gray

if (-not $DryRun) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    Add-Type -AssemblyName System.IO.Compression

    $archive = [System.IO.Compression.ZipFile]::Open($newZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($file in $allFiles) {
            $relPath = $file.FullName.Substring($rootDir.Length + 1)
            $entryName = $relPath.Replace("\", "/")
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    }
    finally {
        $archive.Dispose()
    }

    $zipInfo = Get-Item $newZipPath
    $zipSizeKB = [Math]::Round($zipInfo.Length / 1KB, 1)
    Write-Host "   [OK] Nen thanh cong: $newZipName ($zipSizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "   [DRY-RUN] Bo qua buoc tao file nen." -ForegroundColor DarkYellow
}

# 3. QUET DON & XOAY VONG THEO QUY CHUAN 5 BAN / 3 NGAY
Write-Host "`n[BUOC 2/2] TIEN HANH QUET DON XOAY VONG (KHUNG 3 NGAY - TOI DA 5 BAN)..." -ForegroundColor Yellow

$zipFiles = Get-ChildItem -Path $backupDir -Filter "*.zip" | Where-Object { $_.Name -ne ".gitkeep" }
$parsedBackups = @()

foreach ($f in $zipFiles) {
    $dateKey = ""
    $sortKey = ""
    
    if ($f.Name -match '^BACKUP_.*_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.zip$') {
        $dateKey = $matches[1] + "-" + $matches[2] + "-" + $matches[3]
        $sortKey = $matches[1] + $matches[2] + $matches[3] + "_" + $matches[4] + $matches[5] + $matches[6]
    }
    elseif ($f.Name -match '^autocut_(\d{4}-\d{2}-\d{2})(?:\((\d+)\))?.*\.zip$') {
        $dateKey = $matches[1]
        $idx = if ($matches[2]) { [int]$matches[2] } else { 0 }
        $sortKey = $dateKey.Replace('-','') + "_idx_" + ("{0:D5}" -f $idx)
    }
    else {
        $dateKey = $f.LastWriteTime.ToString("yyyy-MM-dd")
        $sortKey = $f.LastWriteTime.ToString("yyyyMMdd_HHmmss")
    }

    $parsedBackups += [PSCustomObject]@{
        Name = $f.Name
        FullName = $f.FullName
        DateKey = $dateKey
        SortKey = $sortKey
        Size = $f.Length
    }
}

$groupedByDate = $parsedBackups | Group-Object -Property DateKey
$sortedDates = @($groupedByDate | Sort-Object -Property Name -Descending)

$toKeep = [System.Collections.Generic.List[PSCustomObject]]::new()
$toDelete = [System.Collections.Generic.List[PSCustomObject]]::new()

Write-Host "   * Phan tich du lieu: Tim thay $($sortedDates.Count) ngay co ban backup trong kho." -ForegroundColor Gray

for ($dayIndex = 0; $dayIndex -lt $sortedDates.Count; $dayIndex++) {
    $dayGroup = $sortedDates[$dayIndex]
    $filesInDay = @($dayGroup.Group | Sort-Object -Property SortKey -Descending)
    
    if ($dayIndex -eq 0) {
        # Ngay N (Ngay hien tai / moi nhat): Giu toi da 3 ban moi nhat
        $keep = @($filesInDay | Select-Object -First 3)
        $del = @($filesInDay | Select-Object -Skip 3)
        foreach ($k in $keep) { $toKeep.Add($k) }
        foreach ($d in $del) { 
            $toDelete.Add([PSCustomObject]@{ 
                File = $d; 
                Reason = "Ngay N ($($dayGroup.Name)): Vuot qua dinh muc toi da 3 ban trong ngay" 
            }) 
        }
    } elseif ($dayIndex -eq 1) {
        # Ngay N-1 (Ngay hom qua / lien ke): Chi giu duy nhat 1 ban CUOI CUNG cua ngay
        $keep = @($filesInDay | Select-Object -First 1)
        $del = @($filesInDay | Select-Object -Skip 1)
        foreach ($k in $keep) { $toKeep.Add($k) }
        foreach ($d in $del) { 
            $toDelete.Add([PSCustomObject]@{ 
                File = $d; 
                Reason = "UU TIEN 1: Co dong ngay N-1 ($($dayGroup.Name)) - Chi giu duy nhat 1 ban cuoi cung" 
            }) 
        }
    } elseif ($dayIndex -eq 2) {
        # Ngay N-2 (Ngay cu nhat trong khung 3 ngay): Chi giu duy nhat 1 ban CUOI CUNG cua ngay
        $keep = @($filesInDay | Select-Object -First 1)
        $del = @($filesInDay | Select-Object -Skip 1)
        foreach ($k in $keep) { $toKeep.Add($k) }
        foreach ($d in $del) { 
            $toDelete.Add([PSCustomObject]@{ 
                File = $d; 
                Reason = "Khung 3 ngay: Ngay N-2 ($($dayGroup.Name)) - Chi giu duy nhat 1 ban cuoi cung" 
            }) 
        }
    } else {
        # UU TIEN 3: Cat got toan bo cac ngay ngoai khung 3 ngay gan nhat (tu ngay thu 4 tro di)
        foreach ($d in $filesInDay) {
            $toDelete.Add([PSCustomObject]@{ 
                File = $d; 
                Reason = "UU TIEN 3: Nam ngoai khung 3 ngay gan nhat ($($dayGroup.Name)) - Xoa sach" 
            }) 
        }
    }
}

# 4. Thuc hien xoa cac file khong thuoc dinh muc
if ($toDelete.Count -gt 0) {
    Write-Host "`nDANH SACH FILE TIEN HANH XOA ($($toDelete.Count) tep):" -ForegroundColor Red
    foreach ($item in $toDelete) {
        $fName = $item.File.Name
        $fSizeKB = [Math]::Round($item.File.Size / 1KB, 1)
        $reason = $item.Reason
        Write-Host "   [-] XOA: $fName ($fSizeKB KB)" -ForegroundColor DarkRed
        Write-Host "       Ly do: $reason" -ForegroundColor DarkGray
        
        if (-not $DryRun) {
            Remove-Item -LiteralPath $item.File.FullName -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "`n   [OK] Khong co file nao can thanh loc (Dang trong dinh muc)." -ForegroundColor Green
}

# 5. In danh sach cac file duoc luu tru chuan muc
Write-Host "`nDANH SACH BAN SAO LUU DUOC GIU LAI (TONG CONG: $($toKeep.Count)/5 BAN):" -ForegroundColor Cyan
$idx = 1
foreach ($item in $toKeep) {
    $fName = $item.Name
    $fSizeKB = [Math]::Round($item.Size / 1KB, 1)
    $fDate = $item.DateKey
    
    $role = ""
    if ($fDate -eq $sortedDates[0].Name) { $role = "[Ngay N - Hom nay]" }
    elseif ($sortedDates.Count -gt 1 -and $fDate -eq $sortedDates[1].Name) { $role = "[Ngay N-1 - Lien ke]" }
    elseif ($sortedDates.Count -gt 2 -and $fDate -eq $sortedDates[2].Name) { $role = "[Ngay N-2 - Cu nhat khung 3 ngay]" }
    
    Write-Host "   [$idx/$($toKeep.Count)] $role Ngay ${fDate}: $fName ($fSizeKB KB)" -ForegroundColor Green
    $idx++
}

Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "   HOAN TAT BACKUP & XOAY VONG THANH CONG! (TONG SO BAN: $($toKeep.Count) <= 5)" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
