'use client';

import { Project } from '@/types';
import { motion } from 'framer-motion';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProjectListProps {
    initialProjects?: Project[];
    locale: 'tr' | 'en';
}

export default function ProjectList({ initialProjects, locale }: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects || []);
    const [loading, setLoading] = useState(!initialProjects || initialProjects.length === 0);

    useEffect(() => {
        if (initialProjects && initialProjects.length > 0) {
            setProjects(initialProjects);
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
                setProjects(items);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [initialProjects]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                Henüz proje eklenmemiş.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative flex flex-col h-full bg-white dark:bg-black rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
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

                    <div className="flex flex-col flex-1 p-6">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                                {project.title[locale]}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1">
                            {project.description[locale]}
                        </p>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                            <span className="text-sm font-medium text-orange-600 group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                                İncele <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
