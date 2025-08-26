import { Link } from 'react-router-dom';

function Recovery() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-100 rounded-4xl shadow-inner mt-8 overflow-hidden px-4 md:px-0">
        <div
          className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-}
         md:min-h-full justify-center"
        >
          <p className="text-black fonttext-black font-inter text-4xl mb-4 font-bold">
            Recuperar contraseña
          </p>
          <p className="text-black fonttext-black font-inter text-1xl mb-4">
            Ingresa tu email
          </p>
          <form className="w-full flex flex-col items-center">
            <div className="relative inline-block w-full max-w-xs">
              <input
                type="text"
                placeholder="Email"
                className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none mb-4 text-black font-inter"
              />
              <i className="fa-solid fa-envelope absolute top-6 left-4 -translate-y-1/2 text-gray-500 text-1xl pointer-events-none"></i>
            </div>
            {/*
            <div className="relative inline-block w-full max-w-xs">
              <input
                type="text"
                placeholder="Código de verificación"
                className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter"
              />
              <i className="fa-solid fa-asterisk absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 text-[16px] pointer-events-none"></i>
            </div>
            */}
          </form>
          <button className="w-full max-w-xs bg-naranja-1 text-white px-5 py-2.5 rounded-2xl cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg">
            Enviar mail
          </button>
          <p className="text-black font-inter  mb-7">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registration"
              className="font-bold cursor-pointer hover:shadow-sm"
            >
              Regístrate
            </Link>
          </p>
        </div>
        <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto">
          <img
            className="w-full h-full object-cover rounded-tr-4xl rounded-br-4xl shadow-inner"
            src="/images/imagen-registration.jpg"
            alt="Recuperar contraseña"
          />
        </div>
      </div>
    </div>
  );
}
export default Recovery;
