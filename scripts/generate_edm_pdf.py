import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def generate_pdf():
    # 1. Register TTF Fonts
    font_dir = "C:/Windows/Fonts"
    pdfmetrics.registerFont(TTFont("Arial", os.path.join(font_dir, "arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", os.path.join(font_dir, "arialbd.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Italic", os.path.join(font_dir, "ariali.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-BoldItalic", os.path.join(font_dir, "arialbi.ttf")))

    # 2. Load Table Data
    json_path = os.path.join(os.path.dirname(__file__), "pdf_table_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    pdf_filename = "BANG_THONG_SO_CAT_1_PASS_H10_165.pdf"
    
    # Margins: 18pt all around
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=18,
        rightMargin=18,
        topMargin=18,
        bottomMargin=18
    )

    story = []

    # 3. Build Table Headers (CHỈ DUY NHẤT BẢNG NỘI DUNG, KHÔNG CÓ BẤT KỲ TIÊU ĐỀ HAY FOOTER NÀO KHÁC)
    headers = [
        "Vật Liệu", "H", "Ton", "Toff", "IP", "Wire", "Volt", "VF", "Max Speed", "Offset thực tế", "Offset tính toán"
    ]

    header_cells = []
    for h in headers:
        header_cells.append(Paragraph(f"<b>{h}</b>", ParagraphStyle(
            "HStyle", fontName="Arial-Bold", fontSize=8.5, leading=11, alignment=1, textColor=colors.white
        )))

    table_data = [header_cells]

    tstyles = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
        ('TOPPADDING', (0, 0), (-1, 0), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
    ]

    for row_idx, r in enumerate(data, start=1):
        is_real = r.get("isReal", False)
        font_name = "Arial-Italic" if is_real else "Arial"
        text_color = colors.HexColor("#0369a1") if is_real else colors.HexColor("#0f172a")

        # Distinct row background for real data vs alternating calculation rows
        if is_real:
            tstyles.append(('BACKGROUND', (0, row_idx), (-1, row_idx), colors.HexColor("#e0f2fe")))
        elif row_idx % 2 == 0:
            tstyles.append(('BACKGROUND', (0, row_idx), (-1, row_idx), colors.HexColor("#f8fafc")))

        volt_color = colors.HexColor("#dc2626") if r['Volt'] == 'H' else colors.HexColor("#2563eb")

        row_cells = [
            Paragraph(f"<i>{r['material']}</i>" if is_real else r['material'], 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<b><i>{r['H']}</i></b>" if is_real else f"<b>{r['H']}</b>", 
                      ParagraphStyle("C", fontName="Arial-BoldItalic" if is_real else "Arial-Bold", fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<i>{r['Ton']}</i>" if is_real else str(r['Ton']), 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<i>{r['Toff']}</i>" if is_real else str(r['Toff']), 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<i>{r['IP']}</i>" if is_real else str(r['IP']), 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<i>{r['Wire']}</i>" if is_real else str(r['Wire']), 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<b><i>{r['Volt']}</i></b>" if is_real else f"<b>{r['Volt']}</b>", 
                      ParagraphStyle("C", fontName="Arial-BoldItalic" if is_real else "Arial-Bold", fontSize=8.2, leading=10, alignment=1, textColor=volt_color)),
            Paragraph(f"<i>{r['VF']}</i>" if is_real else str(r['VF']), 
                      ParagraphStyle("C", fontName=font_name, fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<b><i>{r['maxSpeed']}</i></b>" if is_real else f"<b>{r['maxSpeed']}</b>", 
                      ParagraphStyle("C", fontName="Arial-BoldItalic" if is_real else "Arial-Bold", fontSize=8.2, leading=10, alignment=1, textColor=text_color)),
            Paragraph(f"<b><i>{r['actualOffset']}</i></b>" if is_real else str(r['actualOffset']), 
                      ParagraphStyle("C", fontName="Arial-BoldItalic" if is_real else "Arial", fontSize=8.2, leading=10, alignment=1, textColor=colors.HexColor("#047857") if is_real else colors.HexColor("#94a3b8"))),
            Paragraph(f"<b><i>{r['calcOffset']}</i></b>" if is_real else f"<b>{r['calcOffset']}</b>", 
                      ParagraphStyle("C", fontName="Arial-BoldItalic" if is_real else "Arial-Bold", fontSize=8.2, leading=10, alignment=1, textColor=colors.HexColor("#1d4ed8"))),
        ]
        table_data.append(row_cells)

    # Column widths totaling exactly 559.27 pt (595.27 - 36 margin)
    col_widths = [53, 30, 36, 36, 30, 34, 34, 36, 73, 97, 100]
    
    # Row padding to make table comfortable and fill nicely on 1 single page
    tstyles.extend([
        ('TOPPADDING', (0, 1), (-1, -1), 3.4),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 3.4),
    ])

    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    table.setStyle(TableStyle(tstyles))
    story.append(table)

    # Build PDF
    doc.build(story)
    print(f"Generated {pdf_filename} successfully (table only)!")

if __name__ == "__main__":
    generate_pdf()
