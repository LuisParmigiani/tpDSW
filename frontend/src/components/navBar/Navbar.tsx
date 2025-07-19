import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

type Usuario = {
  nombre: string;
  foto: string;
};

type Option = {
  nombre: string;
  url: string;
};

function Navbar() {
  const id = undefined; // Aca tine q ir el id del usuario logueado, por ahora lo dejamos undefined
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleToggleNav = () => {
    setShowNav((prev) => !prev);
  };

  // Controlar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (showNav) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNav]);
  const options: Option[] = [
    {
      nombre: 'Servicios',
      url: '/servicios',
    },
    {
      nombre: 'Experiencias',
      url: '/experiencias',
    },
    {
      nombre: 'Sobre nosotros',
      url: '/about',
    },
  ];
  const showOptions = options.map((option) => (
    <li key={option.nombre} className={styles.liNavBar}>
      <Link
        className={styles.linkNavBar}
        to={option.url}
        onClick={() => setShowNav(false)}
      >
        {option.nombre}
      </Link>
    </li>
  ));
  useEffect(() => {
    if (id) {
      axios
        .get<{ data: Usuario }>(`/api/usuario/${id}`)
        .then((res) => setUsuario(res.data.data))
        .catch((err) => console.error('Error al cargar usuario:', err));
    }
  }, [id]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isMobile) {
    return (
      <div className={styles.generalContainerNavBar}>
        <div className={styles.firstContainerNavBar}>
          <ul className={styles.firstListNavBar}>
            <li className={[styles.liNavBar, styles.logoNavBar].join(' ')}>
              <Link to="/">
                <img
                  className={styles.logoImageNavBar}
                  src="/images/logo.png"
                  alt="Logo"
                />
              </Link>
            </li>
            <div className={styles.menuItems}>{showOptions}</div>
          </ul>
        </div>
        <div className={styles.secondContainerNavBar}>
          {usuario ? (
            <a
              className={[styles.buttonNavBar, styles.UserRegistered].join(' ')}
              href="#"
            >
              <p className={styles.nombreUserIdNavBar}>{usuario?.nombre}</p>
              <img
                className={styles.fotoUserIdNavBar}
                src={'/images/fotoUserId.png'}
                alt="Foto de perfil"
              />
            </a>
          ) : (
            <a className={styles.buttonNavBar} href="#">
              Iniciar sesión
            </a>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.generalContainerNavBar}>
        <div className={styles.firstContainerNavBar}>
          <ul className={styles.firstListNavBar}>
            <li className={[styles.liNavBar, styles.logoNavBar].join(' ')}>
              <Link to="/">
                <img
                  className={styles.logoImageNavBar}
                  src="/images/logo.png"
                  alt="Logo"
                />
              </Link>
            </li>
            <li className={styles.liNavBar}>
              <div
                ref={navRef}
                className={styles.deployNav}
                onClick={handleToggleNav}
              >
                {!showNav ? (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Abrir menú"
                    fill="#fff"
                  >
                    <rect x="4" y="6" width="16" height="2" rx="1" />
                    <rect x="4" y="11" width="16" height="2" rx="1" />
                    <rect x="4" y="16" width="16" height="2" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Cerrar menú"
                    fill="#fff"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </div>
              {showNav && (
                <div className={styles.mobileDropdown}>
                  <ul className={styles.navList}>
                    <li className={styles.closeButtonContainer}>
                      <button
                        className={styles.closeButton}
                        onClick={() => setShowNav(false)}
                        aria-label="Cerrar menú"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </li>
                    {showOptions}
                    <li className={styles.liNavBar}>
                      {usuario ? (
                        <Link
                          className={[
                            styles.buttonNavBar,
                            styles.UserRegistered,
                          ].join(' ')}
                          to={`/usuario/${usuario.nombre}`}
                          onClick={() => setShowNav(false)}
                        >
                          <p className={styles.nombreUserIdNavBar}>
                            {usuario?.nombre}
                          </p>
                          <img
                            className={styles.fotoUserIdNavBar}
                            src={'/images/fotoUserId.png'}
                            alt="Foto de perfil"
                          />
                        </Link>
                      ) : (
                        <Link
                          className={styles.buttonNavBar}
                          to="#"
                          onClick={() => setShowNav(false)}
                        >
                          Iniciar sesión
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navbar;
