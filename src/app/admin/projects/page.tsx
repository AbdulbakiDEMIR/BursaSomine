import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProjectListTable from '@/components/admin/ProjectListTable';

export default function AdminProjectsPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projeler</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Projeleri yönetin, düzenleyin veya silin.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Proje
                </Link>
            </div>

            <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                <ProjectListTable />
            </div>
        </div>
    );
}
