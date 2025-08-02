import { useState } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div>
      <div className="flex flex-col items-center h-screen pt-5 pb-5">
        <div
          className="pl-[100px] flex flex-row gap-[100px] w-[80%] h-[70%] bg-[#fff5f2] 
        rounded-[30px] shadow-[10px_10px_45px_rgba(0,0,0,0.3)] mt-[50px]"
        >
          <div className="flex flex-col justify-center items-center w-[50%] h-full">
            <p className="text-black fonttext-black font-inter text-[42px] mb-[15px] font-bold">
              ¡Bienvenido!
            </p>
            <form>
              <div className="relative inline-block">
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full max-w-[300px] pt-[12px] pb-[12px] pr-[20px] pl-[50px] 
                  text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] 
                  outline-none mb-4 text-black font-inter "
                />
                <i className="fa-solid fa-envelope absolute top-[20%] left-4 text-gray-500 text-[16px] pointer-events-none"></i>
              </div>
              <div className="relative inline-block">
                <input
                  type={type_text}
                  placeholder="Contraseña"
                  className="w-full max-w-[300px] pt-[12px] pb-[12px] pr-[20px] pl-[50px] 
                  text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] 
                  outline-none mb-4 text-black font-inter"
                />
                <i className={imag} onClick={handleClickCrossedEye}></i>
                <i className="fa-solid fa-lock absolute top-[20%] left-4 text-gray-500 text-[16px] pointer-events-none"></i>
              </div>
            </form>
            <button
              className="w-full max-w-[300px] bg-(--color-naranja-1) text-whitebg-[#f66731] 
            text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black
            focus:outline-none mb-5 mt-3 hover:shadow-lg"
            >
              Iniciar sesión
            </button>
            <p className="text-black font-inter mb-0">
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
          <div className="w-[500px]">
            <img
              className="w-full h-full object-cover rounded-tr-[30px] rounded-br-[30px] shadow-[10px_10px_45px_0_rgba(0,0,0,0.3)]"
              src="/images/imagen-login.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Logincard;
