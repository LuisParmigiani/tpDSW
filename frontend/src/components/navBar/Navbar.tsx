import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

type Props = {
  id?: number;
};

type Usuario = {
  nombre: string;
  foto: string;
};

type Option = {
  nombre: string;
  url: string;
};

function Navbar({ id }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleToggleNav = () => {
    setShowNav((prev) => !prev);
  };

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNav(false);
      }
    };

    if (showNav) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
              </div>
              {showNav && (
                <div className={styles.mobileDropdown}>
                  <ul className={styles.navList}>
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
