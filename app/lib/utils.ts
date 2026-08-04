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
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = fenced ? fenced[1].trim() : trimmed;
    return JSON.parse(jsonText);
}

export function getAIResponseText(content: AIResponse["message"]["content"]): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        const textPart = content.find(
            (part) => typeof part === "object" && part !== null && "text" in part
        );
        if (textPart && typeof textPart.text === "string") return textPart.text;
    }
    throw new Error("Unexpected AI response format");
}