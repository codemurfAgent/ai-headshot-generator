export const HEADSHOT_STYLES = [
  {
    id: 'corporate',
    name: 'Corporate Professional',
    prompt: 'professional corporate headshot, studio lighting, neutral background, business attire, confident expression, high quality, sharp focus',
    description: 'Perfect for LinkedIn and corporate websites'
  },
  {
    id: 'modern',
    name: 'Modern Business',
    prompt: 'modern professional headshot, contemporary office background, business casual, approachable smile, natural lighting, high resolution',
    description: 'Great for startups and modern companies'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    prompt: 'creative professional portrait, artistic lighting, stylish background, confident but relaxed, vibrant yet professional, editorial quality',
    description: 'Ideal for creatives and entrepreneurs'
  },
  {
    id: 'executive',
    name: 'Executive Portrait',
    prompt: 'executive portrait, dramatic studio lighting, dark background, powerful stance, senior leadership, premium quality, magazine cover worthy',
    description: 'For C-suite and senior executives'
  }
] as const;

export type StyleId = typeof HEADSHOT_STYLES[number]['id'];
