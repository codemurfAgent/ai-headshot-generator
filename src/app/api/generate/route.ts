import { NextRequest, NextResponse } from 'next/server';
import { HEADSHOT_STYLES } from '@/lib/headshot-styles';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // For MVP, return placeholder images
    // In production, this would call Replicate API
    const headshots = HEADSHOT_STYLES.map(style => ({
      style: style.name,
      url: `https://placehold.co/512x512/6B21A8/white?text=${encodeURIComponent(style.name)}`,
      styleId: style.id,
    }));

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      success: true,
      headshots,
      message: 'Headshots generated successfully'
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate headshots' },
      { status: 500 }
    );
  }
}
