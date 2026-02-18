import { Package, Tag, FileText, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${base}/api/products`, { cache: 'no-store' }),
            fetch(`${base}/api/categories`, { cache: 'no-store' }),
        ]);
        const products = productsRes.ok ? await productsRes.json() : { data: [] };
        const categories = categoriesRes.ok ? await categoriesRes.json() : { data: [] };
        return {
            productCount: products.data?.length ?? 0,
            categoryCount: categories.data?.length ?? 0,
            featuredCount: products.data?.filter((p: { isFeatured: boolean }) => p.isFeatured).length ?? 0,
        };
    } catch {
        return { productCount: 0, categoryCount: 0, featuredCount: 0 };
    }
}

const QUICK_LINKS = [
    { href: '/admin/products/new', label: 'Yeni Ürün Ekle', icon: Package, color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-500 dark:text-blue-400' },
    { href: '/admin/categories', label: 'Kategorileri Yönet', icon: Tag, color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-500 dark:text-purple-400' },
    { href: '/admin/pages', label: 'Sayfa İçerikleri', icon: FileText, color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-500 dark:text-green-400' },
    { href: '/admin/settings', label: 'Site Ayarları', icon: Settings, color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-500 dark:text-orange-400' },
];

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bursa Sömine yönetim paneline hoş geldiniz.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Ürün</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.productCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Öne Çıkan</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.featuredCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.categoryCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                            <Tag className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hızlı Erişim</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {QUICK_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
                        >
                            <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10`}>
                                <link.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-sm">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
