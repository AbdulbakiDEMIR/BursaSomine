"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends ImageProps {
    containerClassName?: string;
}

export default function ImageWithLoader({ className, containerClassName, ...props }: ImageWithLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <Skeleton className={cn("absolute inset-0 z-10 w-full h-full bg-gray-200", containerClassName)} />
            )}
            <Image
                className={cn(className, isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-700")}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        </>
    );
}
