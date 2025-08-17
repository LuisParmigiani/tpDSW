import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Logincard() {
  const [imag, setimag] = useState(
    'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
  );

  const [type_text, settypetext] = useState('password');

  const handleClickCrossedEye = () => {
    if (
      imag ==
      'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
    ) {
      setimag(
        'fa-solid fa-eye absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
      );
      settypetext('text');
    } else {
      setimag(
        'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
      );
      settypetext('password');
    }
  };
  const [form, setForm] = useState({ mail: '', contrasena: '' });

  const navegacion = useNavigate();

  async function envioFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert('Credenciales incorrectas');
    }
    if (res.ok) {
      alert('Credenciales correctas');
      navegacion('/');
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-[#fff5f2] rounded-[30px] shadow-lg mt-8 overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <p className="text-black font-inter text-3xl md:text-[42px] mb-6 font-bold text-center">
            ¡Bienvenido!
          </p>
          <form
            className="w-full flex flex-col items-center"
            onSubmit={envioFormulario}
          >
            <div className="relative inline-block w-full">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setForm({ ...form, mail: e.target.value })}
                className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
              />
              <i className="fa-solid fa-envelope absolute top-[20%] left-6 text-gray-500 text-[16px] pointer-events-none"></i>
            </div>
            <div className="relative inline-block w-full">
              <input
                type={type_text}
                placeholder="Contraseña"
                onChange={(e) =>
                  setForm({ ...form, contrasena: e.target.value })
                }
                className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter"
              />
              <i
                className={imag + ' right-6'}
                onClick={handleClickCrossedEye}
              ></i>
              <i className="fa-solid fa-lock absolute top-[20%] left-6 text-gray-500 text-[16px] pointer-events-none"></i>
            </div>
            <button className="w-full bg-[#f66731] text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg">
              Iniciar sesión
            </button>
          </form>

          <p className="text-black font-inter mb-0 text-center">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registration"
              className="font-bold cursor-pointer hover:shadow-sm"
            >
              Regístrate
            </Link>
          </p>
          <Link
            to="/recovery"
            className="text-black font-inter mb-0 font-bold cursor-pointer hover:shadow-sm mt-2"
          >
            Olvidé mi contraseña
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <img
            className="w-full h-64 md:h-full object-cover rounded-b-[30px] md:rounded-tr-[30px] md:rounded-br-[30px]"
            src="/images/imagen-login.png"
            alt="Login"
          />
        </div>
      </div>
    </div>
  );
}
export default Logincard;
