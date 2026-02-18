"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, documentId, getDocs } from 'firebase/firestore';

interface SelectedProjectsProps {
    projects: Project[];
    locale: 'tr' | 'en';
    title: string;
    subtitle: string;
    viewAllText: string;
}

export default function SelectedProjects({ projects, locale, title, subtitle, viewAllText }: SelectedProjectsProps) {
    const [displayProjects, setDisplayProjects] = useState<Project[]>(projects || []);
    const [loading, setLoading] = useState(!projects || projects.length === 0);

    useEffect(() => {
        // If projects were provided by server (and not empty), use them.
        if (projects && projects.length > 0) {
            setDisplayProjects(projects);
            setLoading(false);
            return;
        }

        // Otherwise, fetch client-side
        const fetchClientSide = async () => {
            try {
                // 1. Fetch Home Page Settings to get selected IDs
                const homeDocRef = doc(db, 'pages', 'home');
                const homeSnap = await getDoc(homeDocRef);

                let ids: string[] = [];
                if (homeSnap.exists()) {
                    const data = homeSnap.data();
                    ids = data.selectedProjects || [];
                }

                if (ids.length === 0) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch Projects by IDs
                // Firestore 'in' query supports max 10 items.
                const projectsRef = collection(db, 'projects');
                const q = query(projectsRef, where(documentId(), 'in', ids));
                const querySnapshot = await getDocs(q);

                const fetchedProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Project));

                // Sort by the order in IDs array (Firestore doesn't guarantee order)
                const sorted = ids
                    .map(id => fetchedProjects.find(p => p.id === id))
                    .filter((p): p is Project => !!p && p.isActive !== false); // Default to true if undefined

                setDisplayProjects(sorted);
            } catch (err) {
                console.error('Client-side project fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientSide();
    }, [projects]);

    if (loading) return null; // Or a skeleton
    if (!displayProjects || displayProjects.length === 0) return null;

    return (
        <SectionWrapper className="bg-secondary/30">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">{title}</h2>
                    <p className="text-lg text-muted-foreground">{subtitle}</p>
                </div>
                <Button variant="outline" asChild className="hidden md:inline-flex">
                    <Link href="/projects" className="group">
                        {viewAllText} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayProjects.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            {project.image ? (
                                <ImageWithLoader
                                    src={project.image}
                                    alt={project.title[locale]}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {project.title[locale]}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                {project.location?.[locale] && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{project.location[locale]}</span>
                                    </div>
                                )}
                                {project.date && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{project.date}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                                {project.description[locale]}
                            </p>

                            <div className="pt-4 border-t border-gray-100 mt-auto">
                                <span className="text-sm font-medium text-orange-600 group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                                    İncele <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Button variant="outline" asChild>
                    <Link href="/projects">{viewAllText}</Link>
                </Button>
            </div>
        </SectionWrapper>
    );
}
