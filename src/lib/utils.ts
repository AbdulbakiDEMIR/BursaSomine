import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getBaseUrl() {
    if (typeof window !== "undefined") {
        // Tarayıcıdaysak
        return window.location.origin;
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
        // Environment variable tanımlıysa (Canlı ortam)
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Hiçbiri yoksa localhost (Geliştirme ortamı)
    return "http://localhost:3000";
}