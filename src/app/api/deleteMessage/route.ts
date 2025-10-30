
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebaseAdmin';

/**
 * API endpoint to delete an anonymous message using the Firebase Admin SDK.
 * Accepts a POST request with a JSON body containing { id: "documentId" }.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'Invalid or missing message ID' }, { status: 400 });
    }

    if (!firestoreAdmin) {
      console.error('🔥 firestoreAdmin is null — Firebase not initialized');
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const docRef = firestoreAdmin.collection('anonymous_messages').doc(id);
    await docRef.delete();

    return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in deleteMessage API route:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete message on the server.',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

