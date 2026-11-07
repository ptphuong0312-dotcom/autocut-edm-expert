@echo off
chcp 65001 >nul
title AutoCut EDM Expert - Backup Xoay Vong 5 Ban / 3 Ngay
echo ==============================================================================
echo    AUTOCUT SERVO EDM EXPERT - TIEN ICH BACKUP XOAY VONG 5 BAN / 3 NGAY
echo    Chu so huu: SirPhuong ^| Tuan thu nghiem ngat Quy chuan Backup
echo ==============================================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\backup.ps1"

echo.
echo ==============================================================================
echo Nhan phim bat ky de dong cua so...
pause >nul
