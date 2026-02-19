import {
    Flame, ShieldCheck, Ruler, Thermometer, Zap, Home, Star, Award, CheckCircle, Percent,
    Heart, Sun, Moon, Cloud, Umbrella, Droplets, Wind, Snowflake, Users, Settings,
    Search, PenTool, Hammer,
    LucideIcon
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
    Flame,
    ShieldCheck,
    Ruler,
    Thermometer,
    Zap,
    Home,
    Star,
    Award,
    CheckCircle,
    Percent,
    Heart,
    Sun,
    Moon,
    Cloud,
    Umbrella,
    Droplets,
    Wind,
    Snowflake,
    Users,
    Settings,
    Search,
    PenTool,
    Hammer
};

export const SUPPORTED_ICONS = Object.keys(ICON_MAP);

export type IconName = keyof typeof ICON_MAP;

export const getIcon = (name?: string): LucideIcon => {
    if (name && ICON_MAP[name]) {
        return ICON_MAP[name];
    }
    return Flame; // Default icon
};
