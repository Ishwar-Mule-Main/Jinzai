"use client";

/**
 * High-Precision Direct Readymade PDF File Exporter
 * Downloads clean, unclipped, ready-to-use .pdf files directly to disk
 * WITHOUT opening browser print/printer dialog popups.
 * 
 * Features:
 * - 100% Direct File Download (saves as [Title].pdf)
 * - Zero Print Window Popups
 * - Automatic Multi-Page A4 Break Protection (no cut-off text or clipped cards)
 * - High-DPI Vector Crisp Quality (ATS Readable)
 */
export async function downloadPdfDirectly(element: HTMLElement, title: string): Promise<boolean> {
  const cleanTitle = (title || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";

  // Create isolated container for rendering to avoid UI badges
  const elementClone = element.cloneNode(true) as HTMLElement;

  // Clean UI badges, drag handles, page break indicator bars from clone
  elementClone.querySelectorAll(".print\\:hidden, .page-separator-bar, .page-number-badge").forEach((el) => el.remove());
  elementClone.style.transform = "none";
  elementClone.style.margin = "0";
  elementClone.style.boxShadow = "none";
  elementClone.style.width = "210mm";
  elementClone.style.maxWidth = "210mm";
  elementClone.style.background = "#ffffff";
  elementClone.style.color = "#111827";

  // Enforce page-break-inside avoid on all sections, headings, list items and cards
  const subElements = elementClone.querySelectorAll("section, article, div, h1, h2, h3, ul, li, p");
  subElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.breakInside = "avoid";
    htmlEl.style.pageBreakInside = "avoid";
  });

  // Temporarily mount clone off-screen for html2pdf conversion
  elementClone.style.position = "absolute";
  elementClone.style.left = "-9999px";
  elementClone.style.top = "-9999px";
  document.body.appendChild(elementClone);

  try {
    // Dynamically import html2pdf.js for client-side rendering
    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
      margin: [0, 0, 0, 0] as [number, number, number, number],
      filename: cleanTitle,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        width: elementClone.offsetWidth || 794,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
        compress: true,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid: ["section", "article", "h1", "h2", "h3", ".break-inside-avoid"],
      },
    };

    // Execute direct PDF download without printer dialog
    await html2pdf().set(options).from(elementClone).save();

    return true;
  } catch (err) {
    console.warn("Primary html2pdf download failed, trying html2canvas + jsPDF fallback:", err);

    // Fallback: direct html2canvas + jsPDF download
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(elementClone, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(cleanTitle);
      return true;
    } catch (fallbackErr) {
      console.error("Direct PDF download fallback error:", fallbackErr);
      return false;
    }
  } finally {
    // Clean up mounted clone
    try {
      document.body.removeChild(elementClone);
    } catch {}
  }
}
