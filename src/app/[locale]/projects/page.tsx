import { getTranslations, getLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { apiGetProjects } from '@/lib/apiClient';
import ProjectList from '@/components/ProjectList';

export default async function ProjectsPage() {
    const t = await getTranslations('ProjectsPage');
    const locale = (await getLocale()) as 'tr' | 'en';

    // Server-side fetching (might fail if server env vars missing, but handled by client component fallback)
    const projects = await apiGetProjects();

    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader
                    title={t('title')}
                    subtitle={t('subtitle')}
                />
                <ProjectList initialProjects={projects || []} locale={locale} />
            </SectionWrapper>
        </main>
    );
}
