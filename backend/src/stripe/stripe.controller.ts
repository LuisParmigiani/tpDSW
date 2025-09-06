import Stripe from 'stripe';
import { Request, Response } from 'express';
import { getOauth } from '../usuario/usuario.controler.js';
import { updatePagoSplit } from '../pago/pago.controller.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});
interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
    email: string;
  };
}

// If you have a custom authRequest type, import it here instead of Request
async function createAccount(req: AuthRequest, res: Response) {
  const id = req.user?.id;
  if (!id) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }
  const usuario = await getOauth(Number(id));
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: usuario.mail,
      business_type: 'individual',
      business_profile: {
        name: usuario.nombreFantasia, // opcional
        url: 'https://reformix.site/',
        mcc: '5734',
      },
      individual: {
        first_name: usuario.nombre,
        last_name: usuario.apellido,
        email: usuario.mail,
        phone: usuario.telefono,
        dob: {
          day: 15,
          month: 5,
          year: 1990,
        },
        address: {
          line1: '123 Main St',
          line2: 'Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94103',
          country: 'US',
        },
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 2️⃣ Generar enlace de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/historial/refresh`,
      return_url: `${process.env.FRONTEND_URL}/historial/success`,
      type: 'account_onboarding',
    });
    console.log(`Enlace de onboarding: ${accountLink.url}`);
    res.json({ url: accountLink.url });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: String(err) });
    }
  }
}
async function createSplitPayment(req: Request, res: Response) {
  const { amount, sellerStripeId, turno, userID, userMail } = req.body;

  const platformFeePercentage = 0.05; // 5%
  const applicationFeeAmount = Math.floor(amount * platformFeePercentage);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Turno ${turno}` },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeAmount,
      transfer_data: { destination: sellerStripeId },
      metadata: {
        turnoId: turno.toString(),
        userID: userID.toString(),
        userMail: userMail,
      },
    },
    success_url: `${process.env.FRONTEND_URL}/historial/success`,
    cancel_url: `${process.env.FRONTEND_URL}/historial/canceled`,
  });

  res.json({ url: session.url });
}

export { createAccount, createSplitPayment };
