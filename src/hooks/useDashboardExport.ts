import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const useDashboardExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async (elementId: string) => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Dashboard element not found");
      }

      // Create canvas from the dashboard element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(30, 64, 175); // Primary blue
      pdf.text("SmartQuali - Tableau de Bord", 105, 15, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Rapport généré le ${format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}`,
        105,
        22,
        { align: "center" }
      );
      
      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 26, 190, 26);

      let heightLeft = imgHeight;
      let position = 30;

      // Add first page image
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `SmartQuali - Système de Gestion de la Qualité | Page ${i}/${pageCount}`,
          105,
          290,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `SmartQuali_Dashboard_${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`;
      pdf.save(fileName);
      
      return true;
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportToPDF, isExporting };
};
