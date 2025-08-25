import { useNavigate } from 'react-router-dom';
type cardProps = {
  texto: string;
  redirije: string;
};
export function HomePageCard({ texto, redirije }: cardProps) {
  const navigate = useNavigate();
  const handleClick = (servicio: string) => {
    navigate(
      `/servicios?tipoServicio=${servicio}&zona=Todas&orderBy=calificacion`
    );
  };

  return (
    <div
      className={
        'flex flex-col cursor-pointer items-center flex-1 max-w-80 min-w-72 min-h-80 h-auto rounded-3xl bg-[#fff5f2] shadow-[0_0_40px_0_rgba(0,0,0,0.58)] p-5 box-border justify-between ' +
        'hover:scale-102 transition duration-300 ease-in-out hover:bg-orange-200'
      }
      onClick={() => handleClick(redirije)}
    >
      <svg
        width="105"
        height="104"
        viewBox="0 0 105 104"
        className="fill-white mt-0 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="52.5" cy="52" r="52" fill="white" />
        <g clipPath="url(#clip0_4_1552)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.5625 35.75C32.5625 35.2329 32.7662 34.7369 33.1288 34.3712C33.4915 34.0055 33.9833 33.8 34.4961 33.8H49.9648C50.4777 33.8 50.9695 34.0055 51.3321 34.3712C51.6947 34.7369 51.8984 35.2329 51.8984 35.75C51.8984 36.2672 51.6947 36.7632 51.3321 37.1289C50.9695 37.4946 50.4777 37.7 49.9648 37.7H49.3203V43.55C49.3203 43.8948 49.4561 44.2255 49.6979 44.4693C49.9396 44.7131 50.2675 44.85 50.6094 44.85H56.4102C60.3418 44.85 64.1124 46.4251 66.8925 49.2288C69.6725 52.0325 71.2344 55.8351 71.2344 59.8001V66.3H71.8789C72.3917 66.3 72.8835 66.5055 73.2462 66.8712C73.6088 67.2369 73.8125 67.7329 73.8125 68.25C73.8125 68.7672 73.6088 69.2632 73.2462 69.6289C72.8835 69.9946 72.3917 70.2001 71.8789 70.2001H56.4102C55.8973 70.2001 55.4055 69.9946 55.0429 69.6289C54.6803 69.2632 54.4766 68.7672 54.4766 68.25C54.4766 67.7329 54.6803 67.2369 55.0429 66.8712C55.4055 66.5055 55.8973 66.3 56.4102 66.3H57.0547V60.4501C57.0547 60.1053 56.9189 59.7746 56.6771 59.5308C56.4354 59.287 56.1075 59.1501 55.7656 59.1501H49.9648C46.0332 59.1501 42.2626 57.575 39.4825 54.7713C36.7025 51.9676 35.1406 48.165 35.1406 44.2V37.7H34.4961C33.9833 37.7 33.4915 37.4946 33.1288 37.1289C32.7662 36.7632 32.5625 36.2672 32.5625 35.75ZM60.9219 66.3H67.3672V59.8001C67.3672 56.8694 66.2128 54.0588 64.1579 51.9865C62.1031 49.9142 59.3161 48.75 56.4102 48.75H55.1211V55.25H55.7656C57.1331 55.25 58.4447 55.7979 59.4116 56.7731C60.3786 57.7483 60.9219 59.0709 60.9219 60.4501V66.3ZM39.0078 37.7H45.4531V43.55C45.4531 44.9292 45.9964 46.2518 46.9634 47.227C47.9303 48.2022 49.2419 48.75 50.6094 48.75H51.2539V55.25H49.9648C47.0589 55.25 44.2719 54.0859 42.2171 52.0136C40.1622 49.9413 39.0078 47.1307 39.0078 44.2V37.7Z"
            fill="#F66731"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_1552">
            <rect x="25" y="24" width="55" height="56" rx="25" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h3 className="w-full text-2xl font-bold text-gray-800 text-center my-4 shrink-0">
        {texto}
      </h3>
      <p className="w-9/10 text-base text-gray-600 text-center grow flex items-center justify-center mb-2 leading-relaxed">
        Contratá servicios de {redirije} cerca de tu zona.
      </p>
    </div>
  );
}
