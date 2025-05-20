
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export interface TableColumn {
  header: string;
  dataKey: string;
}

export interface DocumentContentService {
  addTitle(text: string): void;
  addSubtitle(text: string): void;
  addParagraph(text: string): void;
  addSection(title: string, content: string[]): void;
  addTable(headers: string[], rows: RowInput[], title?: string): void;
  addImage(imageUrl: string, x: number, y: number, width: number, height: number): void;
}

export class StandardDocumentContentService implements DocumentContentService {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  public addTitle(text: string): void {
    const pageWidth = this.doc.internal.pageSize.width;
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, pageWidth / 2, 30, { align: "center" });
  }

  public addSubtitle(text: string): void {
    const pageWidth = this.doc.internal.pageSize.width;
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, pageWidth / 2, 40, { align: "center" });
  }

  public addParagraph(text: string): void {
    const pageWidth = this.doc.internal.pageSize.width;
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(text, 10, 50, {
      align: "left",
      maxWidth: pageWidth - 20,
    });
  }

  public getLastAutoTableEndY(): number {
    // Access the lastAutoTable property safely using type assertion
    const docWithTable = this.doc as jsPDF & { lastAutoTable?: { finalY: number } };
    return docWithTable.lastAutoTable?.finalY || 50; // Default to 50 if not available
  }

  public addSection(title: string, content: string[]): void {
    const startY = this.getLastAutoTableEndY() + 10;
    
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, 10, startY);
    
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    
    let currentY = startY + 8;
    content.forEach((line) => {
      this.doc.text(line, 10, currentY);
      currentY += 6;
    });
  }

  public addTable(headers: string[], rows: RowInput[], title?: string): void {
    const startY = title ? this.getLastAutoTableEndY() + 15 : this.getLastAutoTableEndY() + 5;
    
    if (title) {
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(title, 10, startY - 5);
    }
    
    autoTable(this.doc, {
      startY: title ? startY + 5 : startY,
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: {
        fillColor: [60, 98, 85],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
    });
  }

  public addImage(imageUrl: string, x: number, y: number, width: number, height: number): void {
    try {
      this.doc.addImage(imageUrl, "JPEG", x, y, width, height);
    } catch (error) {
      console.error("Error adding image:", error);
    }
  }
}
