'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProjectForm from '../../components/ProjectForm';
import { Project } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function EditProjectPage() {
    const params = useParams();
    const id = params.id as string;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchProject() {
            if (!id) return;
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() } as Project);
                } else {
                    setProject(null);
                }
            } catch (error) {
                console.error(error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [id]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    if (!project) {
        return <div className="p-8 text-center">Proje bulunamadı.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <ProjectForm mode="edit" initialData={project} />
        </div>
    );
}
