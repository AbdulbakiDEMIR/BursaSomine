'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import Link from 'next/link';
import { Pencil, Trash2, FolderGit2, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import DeleteButtonClient from '@/app/admin/projects/DeleteButtonClient';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface ProjectListTableProps {
    initialProjects?: Project[];
}

export default function ProjectListTable({ initialProjects = [] }: ProjectListTableProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(!initialProjects.length);
    const [searchTerm, setSearchTerm] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            setProjects(items);
            setLoading(false);
        }, (error) => {
            console.error("Projects fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = (project.title.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.title.en.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesActive = showActiveOnly ? (project.isActive !== false) : true; // Default to true if undefined

        return matchesSearch && matchesActive;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white"
                    />
                </div>

                <button
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${showActiveOnly
                            ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                    `}
                >
                    {showActiveOnly ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Sadece Aktifler
                        </>
                    ) : (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-current opacity-60" />
                            Tümünü Göster
                        </>
                    )}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900/50">
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Proje</th>
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Durum</th>
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Tarih</th>
                            <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredProjects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <FolderGit2 className="w-10 h-10 opacity-20" />
                                        <p>
                                            {initialProjects.length === 0
                                                ? 'Henüz proje eklenmemiş.'
                                                : 'Arama kriterlerine uygun proje bulunamadı.'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {project.image && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={project.image}
                                                    alt={project.title.tr}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{project.title.tr}</p>
                                                <p className="text-xs text-gray-400">{project.title.en}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {project.isActive !== false ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                                                Pasif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {project.date || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/projects/${project.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <form action={async () => {
                                                // This is a dummy action to make the client component work inside the iteration
                                                // The actual delete logic handled by DeleteButtonClient
                                            }}>
                                                <DeleteButtonClient id={project.id!} />
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                Toplam {filteredProjects.length} proje gösteriliyor
            </div>
        </div>
    );
}
