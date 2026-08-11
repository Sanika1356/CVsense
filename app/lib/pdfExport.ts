// Exports the feedback report to PDF using the browser's native print dialog.
// This is far more reliable than html2canvas because it:
//   - Handles all CSS, gradients, SVGs, and custom fonts natively
//   - Works across all browsers without CORS issues
//   - Lets the user save directly to a file via "Save as PDF"

export async function exportElementToPdf(_element: HTMLElement, fileName: string) {
    // Store the original document title and replace it with our desired filename,
    // so the browser uses it as the default PDF filename in the Save dialog.
    const originalTitle = document.title;
    document.title = fileName.replace(/\.pdf$/i, '');

    // Trigger the browser's print dialog. In Chrome/Edge/Firefox the user can
    // choose "Save as PDF" to download the file directly.
    window.print();

    // Restore the original title after a short delay (after print dialog opens)
    setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
}
