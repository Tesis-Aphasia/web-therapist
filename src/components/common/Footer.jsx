import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <p className="footer-text">© 2025 RehabilitIA — All rights reserved.</p>

      <p className="footer-text">Universidad de los Andes | Vigilada Mineducación</p>

      <p className="footer-text">
        Reconocimiento como Universidad: Decreto 1297 del 30 de mayo de 1964.
      </p>

      <p className="footer-text">
        Reconocimiento personería jurídica: Resolución 28 del 23 de febrero de 1949 — Minjusticia.
      </p>

      <p className="footer-text">
        Edificio Mario Laserna — Cra 1 Este No. 19A-40 Bogotá (Colombia) |
        Tel: (571) 3394949 Ext: 2860, 2861, 2862 | Fax: (571) 3324325
      </p>

      <p className="footer-text">
        <a
          href="https://sistemas.uniandes.edu.co/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          © 2025 — Departamento de Ingeniería de Sistemas y Computación
        </a>
      </p>
    </footer>
  );
};

export default Footer;
