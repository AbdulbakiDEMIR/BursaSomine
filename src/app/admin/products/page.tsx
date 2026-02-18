import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${base}/api/products`, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? [];
    } catch {
        return [];
    }
}

const CATEGORY_LABELS: Record<string, string> = {
    wood: 'Odunlu',
    ethanol: 'Etanollü',
    electric: 'Elektrikli',
};

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ürünler</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{products.length} ürün listeleniyor</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Ürün
                </Link>
            </div>

            <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900/50">
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Ürün</th>
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Kategori</th>
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Fiyat</th>
                            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Öne Çıkan</th>
                            <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-400 py-12">
                                    Henüz ürün eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0] && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name.tr}
                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name.tr}</p>
                                                <p className="text-xs text-gray-400">{product.name.en}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                            {CATEGORY_LABELS[product.category] ?? product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isFeatured ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                                            {product.isFeatured ? 'Evet' : 'Hayır'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteProductButton id={product.id!} name={product.name.tr} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Inline client component for delete
function DeleteProductButton({ id, name }: { id: string; name: string }) {
    return (
        <form action={async () => {
            'use server';
            // Server action — client'ta çalışmaz, bu yüzden ayrı bir client component gerekir
        }}>
            <Link
                href={`/admin/products/${id}/delete`}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title={`${name} sil`}
            >
                <Trash2 className="w-4 h-4" />
            </Link>
        </form>
    );
}
