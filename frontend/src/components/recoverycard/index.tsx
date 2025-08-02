import { Link } from 'react-router-dom';

function Recovery() {
  return (
    <div>
      <div className="flex flex-col items-center h-screen pt-5 pb-5 ">
        <div
          className="pl-[100px] flex flex-row gap-[100px] w-[80%] h-[70%] bg-[#fff5f2] 
        rounded-[30px] shadow-[10px_10px_45px_rgba(0,0,0,0.3)] mt-[50px] "
        >
          <div className="flex flex-col justify-center items-center w-[50%] h-full border ">
            <p className="text-black fonttext-black font-inter text-[40px] mb-[15px] font-bold">
              Recuperar contraseña
            </p>
            <form>
              <div className="relative inline-block ">
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full max-w-[300px] pt-[12px] pb-[12px] pr-[20px] pl-[50px] 
                  text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] 
                  outline-none mb-4 text-black font-inter "
                />
                <i className="fa-solid fa-envelope absolute top-[20%] left-4 text-gray-500 text-[16px] pointer-events-none "></i>
              </div>
              <div className="relative inline-block">
                <input
                  type="text"
                  placeholder="Código de verificación"
                  className="w-full max-w-[300px] pt-[12px] pb-[12px] pr-[20px] pl-[50px] 
                  text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] 
                  outline-none mb-4 text-black font-inter"
                />
                <i className="fa-solid fa-asterisk absolute top-[20%] left-4 text-gray-500 text-[16px] pointer-events-none"></i>
              </div>
            </form>
            <button
              className="w-full max-w-[300px] bg-(--color-naranja-1) text-whitebg-[#f66731] 
            text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black
            focus:outline-none mb-5 mt-3 hover:shadow-lg"
            >
              Ingresar código
            </button>
            <p className="text-black font-inter mb-0 mb-7">
              ¿No tienes cuenta?{' '}
              <Link
                to="/registration"
                className="font-bold cursor-pointer hover:shadow-sm"
              >
                Regístrate
              </Link>
            </p>
          </div>
          <div className="w-[500px]">
            <img
              className="w-full h-full object-cover rounded-tr-[30px] rounded-br-[30px] shadow-[10px_10px_45px_0_rgba(0,0,0,0.3)]"
              src="/images/carousel2.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Recovery;
