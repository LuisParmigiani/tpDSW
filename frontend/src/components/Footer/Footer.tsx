import styles from './Footer.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
  link: string;
}

function Footer() {
  const services: Item[] = [
    { id: 1, name: 'Plomero', link: '#plomero' },
    { id: 2, name: 'Electricista', link: '#electricista' },
    { id: 3, name: 'Carpintero', link: '#carpintero' },
    { id: 4, name: 'Pintor', link: '#pintor' },
    { id: 5, name: 'Constructor', link: '#constructor' },
    { id: 6, name: 'Cerrajero', link: '#cerrajero' },
    { id: 7, name: 'Ver Todos...', link: '#todos' },
  ];

  const us: Item[] = [
    { id: 1, name: 'Inversiones', link: '#inversiones' },
    { id: 2, name: 'Información', link: '#informacion' },
    { id: 3, name: 'Reviews', link: '#reviews' },
    { id: 4, name: 'Equipo', link: '#equipo' },
  ];

  const navegacion: Item[] = [
    { id: 1, name: 'Inicio', link: '#inicio' },
    { id: 2, name: 'Iniciar Sesión', link: '#log-in' },
    { id: 3, name: 'Registrarse', link: '#sign-up' },
    { id: 4, name: 'Servicios', link: '#Servicios' },
    { id: 5, name: 'Reseñas', link: '#Reseñas' },
  ];

  const social: Item[] = [
    { id: 1, name: 'Github', link: '#github' },
    { id: 2, name: 'Instagram', link: '#instagram' },
    { id: 3, name: 'Facebook', link: '#facebook' },
    { id: 4, name: 'Twitter', link: '#twitter' },
  ];

  const [showServices, setShowServices] = useState(false);
  const [showUs, setShowUs] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Funciones para manejar el toggle de las secciones
  const handleToggleServices = () => {
    setShowServices((prev) => !prev);
  };

  const handleToggleUs = () => {
    setShowUs((prev) => !prev);
  };

  const handleToggleNavigation = () => {
    setShowNavigation((prev) => !prev);
  };

  const handleToggleSocial = () => {
    setShowSocial((prev) => !prev);
  };

  // Función para renderizar listas
  const renderList = (list: Item[]) => {
    return list.map((listItem) => (
      <li className={styles.ListItem} key={listItem.id}>
        <Link to={listItem.link}>{listItem.name}</Link>
      </li>
    ));
  };

  // Componente para la flecha animada
  const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
    <span
      style={{
        marginLeft: '8px',
        display: 'inline-block',
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        verticalAlign: 'middle',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 9.5L12 14.5L7 9.5"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );

  return (
    <footer className={styles.footer}>
      {/* Sección de la empresa */}
      <div className={styles.companyColumn}>
        <div className={styles.firstLineCompany}>
          <h4 className={styles.companyName}>Nombre de la Empresa</h4>
          <svg
            width="24"
            height="24"
            viewBox="0 0 31 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minWidth: '24px', minHeight: '24px' }}
          >
            <path
              d="M27.5411 25.0206C27.5411 27.5625 25.48 29.6358 22.9504 29.6358H7.65013C6.42986 29.6309 5.26131 29.1424 4.40074 28.2772C3.54017 27.412 3.05781 26.2409 3.05944 25.0206V20.4024H27.5411V25.0206ZM18.3597 43.3895C18.3597 44.7829 16.9877 45.9222 15.3003 45.9222C13.6159 45.9222 12.2378 44.7829 12.2378 43.3895V32.7136H18.3628L18.3597 43.3895ZM3.06251 17.3276V3.07781H6.92738V17.3276H3.06251ZM9.98682 17.3276V3.07781H13.7966V17.3276H9.98682ZM16.8591 17.3276V3.07781H20.6413V17.3276H16.8591ZM23.7007 17.3276V3.07781H27.5411V17.3276H23.7007ZM0.0245053 0L5.58931e-06 25.0206C-0.00244557 27.0543 0.801396 29.0059 2.23538 30.448C3.66935 31.89 5.61651 32.7047 7.65013 32.7136H9.18138V43.3895C9.18138 46.4826 11.9254 49 15.3003 49C18.6751 49 21.4191 46.4826 21.4191 43.3895V32.7136H22.9504C24.984 32.7047 26.9312 31.89 28.3651 30.448C29.7991 29.0059 30.603 27.0543 30.6005 25.0206L30.625 0H0.0245053Z"
              fill="#000000ff"
            />
          </svg>
        </div>
        <p className={styles.textCompany}>© 2025 Nombre de la Empresa</p>
        <p className={styles.textCompany}>Todos los derechos reservados</p>
      </div>

      {/* Versión móvil con acordeones */}
      {isMobile && (
        <>
          <div className={styles.serviceContainer}>
            <div className={styles.toggleButton} onClick={handleToggleServices}>
              <h4>
                Servicios
                <ArrowIcon isOpen={showServices} />
              </h4>
            </div>
            {showServices && (
              <div className={styles.servicesList}>
                <ul className={styles.List}>{renderList(services)}</ul>
              </div>
            )}
          </div>

          <div className={styles.usContainer}>
            <div className={styles.toggleButton} onClick={handleToggleUs}>
              <h4>
                Sobre Nosotros
                <ArrowIcon isOpen={showUs} />
              </h4>
            </div>
            {showUs && (
              <div className={styles.usList}>
                <ul className={styles.List}>{renderList(us)}</ul>
              </div>
            )}
          </div>

          <div className={styles.navigationContainer}>
            <div
              className={styles.toggleButton}
              onClick={handleToggleNavigation}
            >
              <h4>
                Navegación
                <ArrowIcon isOpen={showNavigation} />
              </h4>
            </div>
            {showNavigation && (
              <div className={styles.navigationList}>
                <ul className={styles.List}>{renderList(navegacion)}</ul>
              </div>
            )}
          </div>

          <div className={styles.socialContainer}>
            <div className={styles.toggleButton} onClick={handleToggleSocial}>
              <h4>
                Redes Sociales
                <ArrowIcon isOpen={showSocial} />
              </h4>
            </div>
            {showSocial && (
              <div className={styles.socialList}>
                <ul className={styles.List}>{renderList(social)}</ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* Versión desktop con columnas */}
      {!isMobile && (
        <>
          <div className={styles.olumn}>
            <h4 className={styles.Title}>Servicios</h4>
            <ul className={styles.List}>{renderList(services)}</ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.Title}>Sobre Nosotros</h4>
            <ul className={styles.List}>{renderList(us)}</ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.Title}>Navegación</h4>
            <ul className={styles.List}>{renderList(navegacion)}</ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.Title}>Redes Sociales</h4>
            <ul className={styles.List}>{renderList(social)}</ul>
          </div>
        </>
      )}
    </footer>
  );
}

export default Footer;
