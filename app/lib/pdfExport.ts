// Exports a DOM element (the feedback report) to a downloadable multi-page PDF.
// Uses dynamic imports so jspdf/html2canvas are only loaded when the user actually
// clicks "Download PDF Report", keeping the initial bundle lean.

export async function exportElementToPdf(element: HTMLElement, fileName: string) {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        // @ts-ignore
        import("html2canvas"),
        // @ts-ignore
        import("jspdf"),
    ]);

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0c14",
        logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // If the content is taller than one page, slice it across multiple pages.
    const ratio = canvas.width / pageWidth;
    const scaledPageHeight = pageHeight * ratio;

    if (canvas.height <= scaledPageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    } else {
        let renderedHeight = 0;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        const ctx = pageCanvas.getContext("2d");

        while (renderedHeight < canvas.height) {
            const sliceHeight = Math.min(scaledPageHeight, canvas.height - renderedHeight);
            pageCanvas.height = sliceHeight;

            if (ctx) {
                ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
                ctx.drawImage(
                    canvas,
                    0, renderedHeight, canvas.width, sliceHeight,
                    0, 0, canvas.width, sliceHeight
                );
            }

            const sliceData = pageCanvas.toDataURL("image/png");
            const sliceDisplayHeight = sliceHeight / ratio;

            if (renderedHeight > 0) {
                pdf.addPage([pageWidth, pageHeight]);
            }
            pdf.addImage(sliceData, "PNG", 0, 0, pageWidth, sliceDisplayHeight);

            renderedHeight += sliceHeight;
        }
    }

    pdf.save(fileName);
}
