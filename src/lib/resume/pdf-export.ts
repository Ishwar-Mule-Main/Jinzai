"use client";

/**
 * High-Precision Vector PDF Export
 * Generates 100% selectable vector text PDF (100% ATS readable)
 * preserving exact template styling, fonts, accent colors, and A4 page breaks.
 */
export async function downloadPdfDirectly(element: HTMLElement, title: string): Promise<boolean> {
  const cleanTitle = (title || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_");

  // Create isolated iframe for pristine vector printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return true;
  }

  // Copy all document stylesheets & font declarations
  const headStyles = Array.from(document.head.querySelectorAll("style, link[rel='stylesheet']"))
    .map((el) => el.outerHTML)
    .join("\n");

  const elementClone = element.cloneNode(true) as HTMLElement;

  // Clean UI badges and preview indicators from clone
  elementClone.querySelectorAll(".print\\:hidden, .page-separator-bar, .page-number-badge").forEach((el) => el.remove());
  elementClone.style.transform = "none";
  elementClone.style.margin = "0";
  elementClone.style.boxShadow = "none";

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${cleanTitle}</title>
        <meta charset="utf-8" />
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .resume-page,
          .resume-protected {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
            position: static !important;
            display: block !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          section, .sortable-item, article, ul, li {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          h1, h2, h3 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
        </style>
      </head>
      <body>
        <div id="print-mount">${elementClone.outerHTML}</div>
      </body>
    </html>
  `);
  doc.close();

  // Wait brief moment for iframe fonts & icons to render
  await new Promise((resolve) => setTimeout(resolve, 350));

  try {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  } catch (err) {
    console.error("Vector PDF print error:", err);
    window.print();
  } finally {
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 1500);
  }

  return true;
}
