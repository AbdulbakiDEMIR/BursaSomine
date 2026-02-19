export type LocalizedString = {
    tr: string;
    en: string;
};

export interface Product {
    id?: string;
    name: LocalizedString;
    description: LocalizedString;
    price: string;
    category: 'wood' | 'ethanol' | 'electric';
    isFeatured: boolean;
    createdAt: string;
    images?: string[];
}

export interface Category {
    id: string; // 'wood', 'ethanol', 'electric'
    title: LocalizedString;
    description: LocalizedString;
    image: string;
}

export interface Project {
    id?: string;
    title: LocalizedString;
    description: LocalizedString;
    image: string;
    date?: string;
    location?: LocalizedString;
    isActive?: boolean;
    createdAt: string;
}

export interface HomePageData {
    hero: {
        title: LocalizedString;
        subtitle: LocalizedString;
    };
    stats: {
        yearsLabel: LocalizedString;
        yearsValue: number;
        projectsLabel: LocalizedString;
        projectsValue: number;
        satisfactionLabel: LocalizedString;
        satisfactionValue: number;
        citiesLabel: LocalizedString;
        citiesValue: number;
    };
    features: Array<{
        title: LocalizedString;
        description: LocalizedString;
        icon?: string;
    }>;
    selectedProjects?: string[]; // IDs of selected projects
    featuredProducts?: {
        title: LocalizedString;
        subtitle: LocalizedString;
        selectedProductIds: string[];
    };
    process?: {
        steps: Array<{
            title: LocalizedString;
            description: LocalizedString;
            icon: string;
        }>;
    };
    categories?: {
        title: LocalizedString;
        subtitle: LocalizedString;
    };
    about: {
        title: LocalizedString;
        description: LocalizedString;
        philosophy: LocalizedString;
        sinceDate: LocalizedString;
        tagline: LocalizedString;
    };
    reviews?: {
        id: string;
        author: string;
        rating: number; // 1-5
        date: string;
        text: string;
    }[];
}

export interface AboutPageData {
    history: Array<{
        date: string;
        description: LocalizedString;
    }>;
    image: string;
    features: Array<{
        title: LocalizedString;
        icon: string;
    }>;
    vision: LocalizedString;
    mission: {
        tr: string[];
        en: string[];
    };
    values: Array<{
        icon: string;
        title: LocalizedString;
        description: LocalizedString;
    }>;
    valuesDescription: LocalizedString;
}

export interface FaqPageData {
    faqs: Array<{
        question: LocalizedString;
        answer: LocalizedString;
    }>;
}

export interface SiteSettings {
    brandName: string;
    contact: {
        address: string;
        phone: string;
        email: string;
        hours: LocalizedString;
    };
    socialMedia: {
        instagram: string;
        facebook?: string;
    };
}
