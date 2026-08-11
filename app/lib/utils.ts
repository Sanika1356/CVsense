import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // Determine the appropriate unit by calculating the log
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Format with 2 decimal places and round
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

export function extractJsonFromText(text: string): unknown {
    const trimmed = text.trim();

    // 1. Try to extract from a fenced code block (```json ... ``` or ``` ... ```)
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
        try { return JSON.parse(fenced[1].trim()); } catch { /* fall through */ }
    }

    // 2. Try to parse the full text as JSON directly
    try { return JSON.parse(trimmed); } catch { /* fall through */ }

    // 3. Try to extract the first JSON object/array from the text
    const objMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objMatch) {
        try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
    }
    const arrMatch = trimmed.match(/\[[\s\S]*\]/);
    if (arrMatch) {
        try { return JSON.parse(arrMatch[0]); } catch { /* fall through */ }
    }

    throw new Error(`Could not extract JSON from AI response. Raw text: ${trimmed.slice(0, 200)}`);
}

export function getAIResponseText(content: AIResponse["message"]["content"]): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        // Handle OpenAI-style { type: 'text', text: '...' } parts
        const textPart = content.find(
            (part) => typeof part === "object" && part !== null && "text" in part
        );
        if (textPart && typeof textPart.text === "string") return textPart.text;
        // Fallback: join any string elements
        const strings = content.filter((p) => typeof p === "string");
        if (strings.length > 0) return strings.join("");
    }
    throw new Error(`Unexpected AI response format. Content type: ${typeof content}`);
}