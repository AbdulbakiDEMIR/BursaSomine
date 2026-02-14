import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerClassName?: string;
}

export function SectionWrapper({
    children,
    className,
    containerClassName,
    ...props
}: SectionWrapperProps) {
    return (
        <section className={cn("py-8 flex justify-center ", className)} {...props}>
            <div className={cn("container px-4 md:px-6 ", containerClassName)}>
                {children}
            </div>
        </section>
    );
}
