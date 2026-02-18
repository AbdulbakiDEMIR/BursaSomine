import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const adminDb = getAdminDb();
        const doc = await adminDb.collection('projects').doc(id).get();
        if (!doc.exists) {
            return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const adminDb = getAdminDb();
        await adminDb.collection('projects').doc(id).update(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const adminDb = getAdminDb();
        await adminDb.collection('projects').doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
    }
}
