import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
}

export function SectionHeader({
    title,
    subtitle,
    align = 'center',
    className,
    ...props
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 mb-12",
                align === 'center' && "items-center text-center",
                align === 'right' && "items-end text-right",
                className
            )}
            {...props}
        >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-muted-foreground max-w-[800px]">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
