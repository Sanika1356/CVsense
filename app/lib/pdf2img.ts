export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    loadPromise = (async () => {
        try {
            // @ts-expect-error - pdfjs-dist is not a module
            const lib = await import("pdfjs-dist");
            // Use a CDN for the worker to ensure it matches the library version exactly
            // and is always accessible.
            const version = lib.version || '5.7.284';
            lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
            pdfjsLib = lib;
            isLoading = false;
            return lib;
        } catch (error) {
            isLoading = false;
            loadPromise = null;
            console.error("Failed to load PDF.js library:", error);
            throw error;
        }
    })();

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = lib.getDocument({ 
            data: arrayBuffer,
            // Add these for better compatibility
            useSystemFonts: true,
            stopAtErrors: false,
        });
        
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Scale 2 is usually enough for ATS and saves memory
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) {
            throw new Error("Failed to get 2d context from canvas");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        await page.render(renderContext).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob from canvas",
                        });
                    }
                },
                "image/png",
                0.9 // Slightly reduced quality for better performance/size
            );
        });
    } catch (err) {
        console.error("PDF Conversion Error:", err);
        return {
            imageUrl: "",
            file: null,
            error: err instanceof Error ? err.message : String(err),
        };
    }
}
