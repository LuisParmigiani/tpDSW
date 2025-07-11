import styles from './navBar.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  id?: number;
};

type Usuario = {
  nombre: string;
  foto: string;
};

function NavBar({ id }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get<{ data: Usuario }>(`/api/usuario/${id}`)
        .then((res) => setUsuario(res.data.data))
        .catch((err) => console.error('Error al cargar usuario:', err));
    }
  }, [id]);
  return (
    <div className={styles.generalContainerNavBar}>
      <div className={styles.firstContainerNavBar}>
        <ul className={styles.firstListNavBar}>
          <li className={[styles.liNavBar, styles.logoNavBar].join(' ')}>
            <a href="#">
              <img
                className={styles.logoImageNavBar}
                src="/images/logo.png"
                alt="Logo"
              />
            </a>
          </li>
          <div className={styles.menuItems}>
            <li className={styles.liNavBar}>
              <a className={styles.linkNavBar} href="#">
                Servicios
              </a>
            </li>
            <li className={styles.liNavBar}>
              <a className={styles.linkNavBar} href="#">
                Experiencias
              </a>
            </li>
            <li className={styles.liNavBar}>
              <a className={styles.linkNavBar} href="#">
                Sobre nosotros
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className={styles.secondContainerNavBar}>
        {usuario ? (
          <a
            className={[styles.buttomnNavBar, styles.UserRegistered].join(' ')}
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
          <a className={styles.buttomnNavBar} href="#">
            Iniciar sesión
          </a>
        )}
      </div>
    </div>
  );
}

export default NavBar;
