import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';

function Logincard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [imag, setimag] = useState(
    'fa-solid fa-eye-slash absolute top-4 left-80 text-gray-500 text-4 cursor-pointer'
  );

  const [type_text, settypetext] = useState('password');

  const handleClickCrossedEye = () => {
    if (
      imag ==
      'fa-solid fa-eye-slash absolute top-4 left-80 text-gray-500 text-4 cursor-pointer'
    ) {
      setimag(
        'fa-solid fa-eye absolute top-4 left-80 text-gray-500 text-4 cursor-pointer'
      );
      settypetext('text');
    } else {
      setimag(
        'fa-solid fa-eye-slash absolute top-4 left-80 text-gray-500 text-4 cursor-pointer'
      );
      settypetext('password');
    }
  };
  const [form, setForm] = useState({ mail: '', contrasena: '' });

  const envioFormulario = async () => {
    try {
      await usuariosApi.login(form);
      console.log('Login exitoso');
      navigate('/dashboard');
    } catch (error) {
      setOpen(true);
      const err = error as { response?: { status?: number } };
      if (err.response && err.response.status === 401) {
        setMessage('Mail o contraseña incorrectos');
      } else {
        setMessage('Error en el login');
      }
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-5 backdrop-blur-md bg-opacity-40 z-50">
          <div className="text-black bg-white p-4 rounded shadow-md">
            <div className="flex justify-end z-30 bg-transparent w-auto">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p>{message}</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-gray-100 rounded-4xl shadow-lg mt-8 overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
            <p className="text-black font-inter text-3xl md:text-5xl mb-6 font-bold text-center">
              ¡Bienvenido!
            </p>
            <div className="w-full flex flex-col items-center">
              <div className="relative inline-block w-full">
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setForm({ ...form, mail: e.target.value })}
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none mb-4 text-black font-inter "
                />
                <i className="fa-solid fa-envelope absolute top-4 left-6 text-gray-500 text-1xl pointer-events-none"></i>
              </div>
              <div className="relative inline-block w-full">
                <input
                  type={type_text}
                  placeholder="Contraseña"
                  onChange={(e) =>
                    setForm({ ...form, contrasena: e.target.value })
                  }
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none mb-4 text-black font-inter"
                />
                <i
                  className={imag + ' right-6'}
                  onClick={handleClickCrossedEye}
                ></i>
                <i className="fa-solid fa-lock absolute top-4 left-6 text-gray-500 text-1xl pointer-events-none"></i>
              </div>
              <button
                onClick={envioFormulario}
                type="submit"
                className={
                  form.mail === '' || form.contrasena === ''
                    ? 'w-full bg-gray-300 text-black-500 px-5 py-2.5 rounded-b-2xl cursor-pointer focus:outline-none mb-5 mt-3 '
                    : 'w-full bg-naranja-1 text-white px-5 py-2.5 rounded-b-2xl cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg'
                }
                disabled={form.mail === '' || form.contrasena === ''}
              >
                Iniciar sesión
              </button>
            </div>

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
              className="w-full h-64 md:h-full object-cover rounded-b-4xl md:rounded-tr-4xl md:rounded-br-4xl"
              src="/images/imagen-login.png"
              alt="Login"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default Logincard;
