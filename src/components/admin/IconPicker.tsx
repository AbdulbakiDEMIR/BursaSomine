
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ICON_MAP, SUPPORTED_ICONS } from '@/components/ui/icons';

interface IconPickerProps {
    selectedIcon?: string;
    onSelect: (icon: string) => void;
}

export const IconPicker = ({ selectedIcon, onSelect }: IconPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SelectedIconComponent = selectedIcon && ICON_MAP[selectedIcon as keyof typeof ICON_MAP] ? ICON_MAP[selectedIcon as keyof typeof ICON_MAP] : null;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors gap-3"
            >
                <div className="flex items-center gap-3">
                    {SelectedIconComponent ? (
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-600 dark:text-orange-400">
                            <SelectedIconComponent className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-400">?</div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedIcon || 'İkon Seçiniz'}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {SUPPORTED_ICONS.map((iconName) => {
                            const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
                            const isSelected = selectedIcon === iconName;

                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onSelect(iconName);
                                        setIsOpen(false);
                                    }}
                                    className={`p-2 rounded-md flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-orange-500 text-white shadow-md scale-110'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    title={iconName}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
