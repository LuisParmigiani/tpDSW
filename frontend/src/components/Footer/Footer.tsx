import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.companyColumn}>
        <div className={styles.firstLineCompany}>
          <h4 className={styles.companyName}> Nombre de la Empresa</h4>
          <svg
            width="3vh"
            height="3vh"
            viewBox="0 0 31 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minWidth: '4vh', minHeight: '4vh' }}
          >
            <path
              d="M27.5411 25.0206C27.5411 27.5625 25.48 29.6358 22.9504 29.6358H7.65013C6.42986 29.6309 5.26131 29.1424 4.40074 28.2772C3.54017 27.412 3.05781 26.2409 3.05944 25.0206V20.4024H27.5411V25.0206ZM18.3597 43.3895C18.3597 44.7829 16.9877 45.9222 15.3003 45.9222C13.6159 45.9222 12.2378 44.7829 12.2378 43.3895V32.7136H18.3628L18.3597 43.3895ZM3.06251 17.3276V3.07781H6.92738V17.3276H3.06251ZM9.98682 17.3276V3.07781H13.7966V17.3276H9.98682ZM16.8591 17.3276V3.07781H20.6413V17.3276H16.8591ZM23.7007 17.3276V3.07781H27.5411V17.3276H23.7007ZM0.0245053 0L5.58931e-06 25.0206C-0.00244557 27.0543 0.801396 29.0059 2.23538 30.448C3.66935 31.89 5.61651 32.7047 7.65013 32.7136H9.18138V43.3895C9.18138 46.4826 11.9254 49 15.3003 49C18.6751 49 21.4191 46.4826 21.4191 43.3895V32.7136H22.9504C24.984 32.7047 26.9312 31.89 28.3651 30.448C29.7991 29.0059 30.603 27.0543 30.6005 25.0206L30.625 0H0.0245053Z"
              fill="#F5F7FA"
            />
          </svg>
        </div>
        <p className={styles.textCompany}>@2025 nombre de la empresa</p>
        <p className={styles.textCompany}>Todos los derechos reservados </p>
      </div>
      <div className={styles.serviceColumn}>
        <h4 className={styles.Title}>Servicios</h4>
        <ul className={styles.List}>
          <li className={styles.ListItem}>
            <a href="#plomero">Plomero </a>
          </li>
          <li className={styles.ListItem}>
            <a href="#electrisista">Electrisista </a>
          </li>
          <li className={styles.ListItem}>
            <a href="#carpintero">Carpintero </a>
          </li>
          <li className={styles.ListItem}>
            <a href="#pintor">Pintor</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#constructor">Constructor</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#cerrajero">Cerrajero</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#todos">Ver Todos...</a>
          </li>
        </ul>
      </div>
      <div className={styles.usColumn}>
        <h4 className={styles.Title}>Sobre Nosotros</h4>
        <ul className={styles.List}>
          <li className={styles.ListItem}>
            <a href="#inversiones">Inversiones</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#informacion">Informacion</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#reviews">Reviews</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#equipo">Equipo</a>
          </li>
        </ul>
      </div>
      <div className={styles.navigationColumn}>
        <h4 className={styles.Title}>Navegacion</h4>
        <ul className={styles.List}>
          <li className={styles.ListItem}>
            <a href="#inicio">Inicio</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#log-in">Log-In</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#sign-up">Sign-Up</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#Servicios">Servicios</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#Reseñas">Reseñas</a>
          </li>
        </ul>
      </div>
      <div className={styles.socialColumn}>
        <h4 className={styles.Title}>Redes Sociales</h4>
        <ul className={styles.List}>
          <li className={styles.ListItem}>
            <a href="#github">Github</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#instagram">Instagram</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#facebook">Facebook</a>
          </li>
          <li className={styles.ListItem}>
            <a href="#twitter">Twitter</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
