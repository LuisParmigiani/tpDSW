import Navbar from '../Navbar/Navbar.tsx';
import Carousel from '../Carousel/Carousel.tsx';
import Comments from '../Comments/Comments.tsx';
import Footer from '../Footer/Footer';
import { HomePageCard } from './HomePageCards.js';
function Homepage() {
  const CommentOne = 1;
  const CommentTwo = 2;
  const textos: string[] = [
    'Plomero',
    'Electricista',
    'Carpintero',
    'Pintor',
    'Albañil',
    'Cerrajero',
    'Jardinero',
    'Limpiador',
    'Control de Plagas',
  ];
  const redirecciones: string[] = [
    'Plomeria',
    'Electricidad',
    'Carpinteria',
    'Pintura',
    'Construccion',
    'Cerrajeria',
    'Jardineria',
    'Limpieza Residencial',
    'Control de Plagas',
  ];
  const cards = textos.map((texto, index) => (
    <HomePageCard key={index} texto={texto} redirije={redirecciones[index]} />
  ));

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="absolute inset-0 w-full z-20">
          <Navbar />
        </div>
        {/* Botón de pago Mercado Pago integrado */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-naranja-1 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-orange-600 transition"
            onClick={() => {
              window.location.href =
                import.meta.env.VITE_LOCAL === 'true'
                  ? 'http://localhost:3000/api/mp/connect'
                  : 'https://backend-patient-morning-1303.fly.dev/api/mp/connect';
            }}
          >
            Probar Mercado Pago OAuth
          </button>
        </div>
        <div className="w-full">
          <Carousel
            fotos={[
              '/images/carousel1.jpg',
              '/images/carousel2.jpg',
              '/images/carousel.jpg',
            ]}
            titulo="Reformix"
          />
        </div>
      </div>

      <div className="flex flex-col items-center content-center align-center p-11 bg-white w-full m-0 h-96">
        <h2 className="text-5xl  font-bold text-[#333] m-0 mt-3">
          La solucion de tus <span className="text-naranja-1">problemas</span>
          , <br /> al alcance de un
          <span className="text-naranja-1"> click</span>.
        </h2>
        <img
          className="max-w-2/12 max-h-2/12 mt-auto"
          src="/images/down-arrow.png"
          alt="Flecha para abajo"
        />
      </div>

      <div className="bg-[#4d4d4d] flex flex-col pb-5">
        <div className="mt-9 flex flex-row justify-around w-full gap-5 flex-wrap ">
          {cards}
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-100 to-teal-900">
        <h1 className="mt-0 pt-12 text-black mb-20 text-4xl lg:text-6xl m-17">
          No nos escuches a nosotros, escucha a nuestros{' '}
          <span className="text-naranja-1">clientes.</span>
        </h1>
        <div className="flex flex-col w-full ">
          <div className="self-end  lg:w-5/12 w-10/12 max-h-40 mb-9 mr-7">
            <Comments id={CommentOne} />
          </div>
          <div className="self-start lg:w-5/12 w-10/12 ml-9 max-h-40 mb-5">
            <Comments id={CommentTwo} />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Homepage;
