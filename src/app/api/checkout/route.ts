import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { packageType = 'STANDARD', imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(packageType, imageUrl);
    
    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
