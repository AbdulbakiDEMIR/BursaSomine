import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { Project } from '@/types';

export async function GET() {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb.collection('projects').orderBy('createdAt', 'desc').get();
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error('Projects fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation
        if (!body.title?.tr || !body.image) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newProject = {
            ...body,
            createdAt: new Date().toISOString(),
        };

        const adminDb = getAdminDb();
        const docRef = await adminDb.collection('projects').add(newProject);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newProject } });
    } catch (error) {
        console.error('Project create error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
    }
}
