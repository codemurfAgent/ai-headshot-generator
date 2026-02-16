import { HEADSHOT_STYLES, StyleId } from './headshot-styles';

interface GenerationResult {
  styleId: StyleId;
  imageUrl: string;
  success: boolean;
  error?: string;
}

export async function generateHeadshot(
  inputImageUrl: string,
  styleId: StyleId
): Promise<GenerationResult> {
  const style = HEADSHOT_STYLES.find(s => s.id === styleId);
  if (!style) {
    return { styleId, imageUrl: '', success: false, error: 'Invalid style' };
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: style.prompt,
        negative_prompt: "cartoon, anime, low quality, blurry, distorted, ugly, bad anatomy",
        image: inputImageUrl,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        strength: 0.75,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return { styleId, imageUrl: '', success: false, error };
  }

  const prediction = await response.json();
  
  // Poll for result
  let result = prediction;
  let attempts = 0;
  const maxAttempts = 60; // 2 minutes max
  
  while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 2000));
    
    const pollResponse = await fetch(result.urls.get, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      }
    });
    
    if (!pollResponse.ok) {
      return { styleId, imageUrl: '', success: false, error: 'Failed to poll result' };
    }
    
    result = await pollResponse.json();
    attempts++;
  }

  if (result.status === 'failed') {
    return { styleId, imageUrl: '', success: false, error: result.error || 'Generation failed' };
  }

  const output = Array.isArray(result.output) ? result.output[0] : result.output;
  
  return {
    styleId,
    imageUrl: output,
    success: true
  };
}

export async function generateAllHeadshots(
  inputImageUrl: string
): Promise<GenerationResult[]> {
  const promises = HEADSHOT_STYLES.map(style => 
    generateHeadshot(inputImageUrl, style.id)
  );
  
  return Promise.all(promises);
}
