import { useState } from 'react';
import { stripeApi } from '../../services/stripeApi';

function StripeCreate() {
  const [email, setEmail] = useState('');

  const handleClick = async () => {
    const res = await stripeApi.create();
    const data = res.data;
    window.location.href = data.url;
  };

  return (
    <div style={{ padding: 50 }} className="bg-amber-500">
      <h1>Conectar con Stripe</h1>
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleClick} style={{ marginLeft: 10 }}>
        Completar información
      </button>
    </div>
  );
}

export default StripeCreate;
