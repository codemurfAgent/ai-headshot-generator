import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});

export const PRICING = {
  SINGLE: {
    id: 'single_headshot',
    name: 'Single Headshot',
    price: 900, // $9.00 in cents
    description: '1 professional headshot in your chosen style'
  },
  STANDARD: {
    id: 'standard_package',
    name: 'Standard Package',
    price: 1900, // $19.00 in cents
    description: '4 professional headshots in 4 different styles',
    popular: true
  },
  PREMIUM: {
    id: 'premium_package',
    name: 'Premium Package',
    price: 3900, // $39.00 in cents
    description: '8 headshots + source files + priority processing'
  }
} as const;

export async function createCheckoutSession(
  packageType: keyof typeof PRICING,
  imageUrl: string,
  customerId?: string
) {
  const pkg = PRICING[packageType];
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: pkg.name,
          description: pkg.description,
        },
        unit_amount: pkg.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    metadata: {
      packageType,
      imageUrl,
    }
  });

  return session;
}

export async function verifyPayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return {
    paid: session.payment_status === 'paid',
    packageType: session.metadata?.packageType,
    imageUrl: session.metadata?.imageUrl,
  };
}
