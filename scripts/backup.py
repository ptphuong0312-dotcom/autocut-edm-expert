#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HỆ THỐNG BACKUP TỰ ĐỘNG XOAY VÒNG (QUY CHUẨN 5 BẢN / 3 NGÀY)
DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
CHỦ SỞ HỮU: SirPhuong (ptphuong0312@gmail.com)
"""

import os
import sys
import re
import zipfile
from datetime import datetime
from collections import defaultdict

PROJECT_NAME = "AutoCut_EDM_Expert"
EXCLUDE_DIRS = {'backups', '.git', 'node_modules', '__pycache__', '.venv', '.vercel'}
EXCLUDE_EXTS = {'.zip'}

def get_root_dir():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(script_dir) == 'scripts':
        return os.path.dirname(script_dir)
    return script_dir

def create_backup(root_dir, backup_dir, project_name):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"BACKUP_{project_name}_{timestamp}.zip"
    zip_path = os.path.join(backup_dir, zip_name)

    print(f"\n[BƯỚC 1/2] 📦 ĐANG NÉN DỮ LIỆU DỰ ÁN THÀNH: {zip_name} ...")
    
    files_to_zip = []
    for root, dirs, files in os.walk(root_dir):
        # Exclude directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if any(file.lower().endswith(ext) for ext in EXCLUDE_EXTS):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, root_dir)
            files_to_zip.append((full_path, rel_path))
            
    print(f"   • Tìm thấy {len(files_to_zip)} tệp tin hợp lệ cần nén (Đã loại trừ backups, .git, node_modules, *.zip...).")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for full_path, rel_path in files_to_zip:
            # Normalize to forward slash for zip archive
            entry_name = rel_path.replace(os.sep, '/')
            zipf.write(full_path, entry_name)
            
    size_kb = round(os.path.getsize(zip_path) / 1024, 1)
    print(f"   ✅ Nén thành công: {zip_name} ({size_kb} KB)")
    return zip_path

def rotate_backups(backup_dir):
    print("\n[BƯỚC 2/2] 🧹 TIẾN HÀNH QUÉT DỌN XOAY VÒNG (KHUNG 3 NGÀY - TỐI ĐA 5 BẢN)...")
    
    zip_files = [f for f in os.listdir(backup_dir) if f.lower().endswith('.zip') and f != '.gitkeep']
    
    parsed = []
    for f in zip_files:
        full_path = os.path.join(backup_dir, f)
        size = os.path.getsize(full_path)
        
        # Pattern 1: BACKUP_[Name]_YYYYMMDD_HHMMSS.zip
        m1 = re.match(r'^BACKUP_.*_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.zip$', f)
        if m1:
            date_key = f"{m1.group(1)}-{m1.group(2)}-{m1.group(3)}"
            sort_key = f"{m1.group(1)}{m1.group(2)}{m1.group(3)}_{m1.group(4)}{m1.group(5)}{m1.group(6)}"
        else:
            # Pattern 2: autocut_YYYY-MM-DD(n).zip
            m2 = re.match(r'^autocut_(\d{4}-\d{2}-\d{2})(?:\((\d+)\))?.*\.zip$', f)
            if m2:
                date_key = m2.group(1)
                idx = int(m2.group(2)) if m2.group(2) else 0
                sort_key = f"{date_key.replace('-', '')}_idx_{idx:05d}"
            else:
                mtime = datetime.fromtimestamp(os.path.getmtime(full_path))
                date_key = mtime.strftime("%Y-%m-%d")
                sort_key = mtime.strftime("%Y%m%d_%H%M%S")
                
        parsed.append({
            'name': f,
            'path': full_path,
            'date': date_key,
            'sort_key': sort_key,
            'size': size
        })
        
    # Group by date
    grouped = defaultdict(list)
    for item in parsed:
        grouped[item['date']].append(item)
        
    sorted_dates = sorted(grouped.keys(), reverse=True)
    print(f"   • Phân tích dữ liệu: Tìm thấy {len(sorted_dates)} ngày có bản backup trong kho.")
    
    to_keep = []
    to_delete = []
    
    for day_idx, date in enumerate(sorted_dates):
        files_in_day = sorted(grouped[date], key=lambda x: x['sort_key'], reverse=True)
        
        if day_idx == 0:
            # Ngày N (Ngày hiện tại / mới nhất): Giữ tối đa 3 bản mới nhất
            keep = files_in_day[:3]
            delete = files_in_day[3:]
            to_keep.extend(keep)
            for d in delete:
                to_delete.append((d, f"Ngày N ({date}): Vượt quá định mức tối đa 3 bản trong ngày"))
        elif day_idx == 1:
            # Ngày N-1: Giữ duy nhất 1 bản cuối cùng
            keep = files_in_day[:1]
            delete = files_in_day[1:]
            to_keep.extend(keep)
            for d in delete:
                to_delete.append((d, f"ƯU TIÊN 1: Cô đọng ngày N-1 ({date}) - Chỉ giữ duy nhất 1 bản cuối cùng"))
        elif day_idx == 2:
            # Ngày N-2: Giữ duy nhất 1 bản cuối cùng
            keep = files_in_day[:1]
            delete = files_in_day[1:]
            to_keep.extend(keep)
            for d in delete:
                to_delete.append((d, f"Khung 3 ngày: Ngày N-2 ({date}) - Chỉ giữ duy nhất 1 bản cuối cùng"))
        else:
            # Ngoài khung 3 ngày: Xóa sạch toàn bộ
            for d in files_in_day:
                to_delete.append((d, f"ƯU TIÊN 3: Nằm ngoài khung 3 ngày gần nhất ({date}) - Xóa sạch"))
                
    # Perform deletion
    if to_delete:
        print(f"\n🗑️ DANH SÁCH FILE TIẾN HÀNH XÓA ({len(to_delete)} tệp):")
        for item, reason in to_delete:
            size_kb = round(item['size'] / 1024, 1)
            print(f"   [-] XÓA: {item['name']} ({size_kb} KB)")
            print(f"       Lý do: {reason}")
            try:
                os.remove(item['path'])
            except Exception as e:
                print(f"       Lỗi xóa file: {e}")
    else:
        print("\n   ✨ Không có file nào cần thanh lọc (Đang trong định mức).")
        
    print(f"\n✅ DANH SÁCH BẢN SAO LƯU ĐƯỢC GIỮ LẠI (TỔNG CỘNG: {len(to_keep)}/5 BẢN):")
    for idx, item in enumerate(to_keep, 1):
        size_kb = round(item['size'] / 1024, 1)
        role = ""
        if item['date'] == sorted_dates[0]:
            role = "[Ngày N - Hôm nay]"
        elif len(sorted_dates) > 1 and item['date'] == sorted_dates[1]:
            role = "[Ngày N-1 - Liền kề]"
        elif len(sorted_dates) > 2 and item['date'] == sorted_dates[2]:
            role = "[Ngày N-2 - Cũ nhất khung 3 ngày]"
            
        print(f"   [{idx}/{len(to_keep)}] {role} Ngày {item['date']}: {item['name']} ({size_kb} KB)")
        
    print("\n" + "=" * 78)
    print(f"   🎉 HOÀN TẤT BACKUP & XOAY VÒNG THÀNH CÔNG! (TỔNG SỐ BẢN: {len(to_keep)} <= 5)")
    print("=" * 78)

def main():
    root_dir = get_root_dir()
    backup_dir = os.path.join(root_dir, "backups")
    os.makedirs(backup_dir, exist_ok=True)
    
    print("=" * 78)
    print("   🔄 HỆ THỐNG BACKUP XOAY VÒNG 5 BẢN / 3 NGÀY - SIRPHUONG EDM EXPERT")
    print(f"   Thư mục gốc : {root_dir}")
    print(f"   Thư mục lưu : {backup_dir}")
    print("=" * 78)
    
    create_backup(root_dir, backup_dir, PROJECT_NAME)
    rotate_backups(backup_dir)

if __name__ == "__main__":
    main()
