import { Link } from 'react-router-dom';
import styles from './Button.module.css';

// Navegación con aspecto de botón. Usamos <Link> (no <a href>) para que
// React Router cambie de ruta sin recargar la página ni perder el estado.
export default function LinkButton({ to, variant = 'secondary', children }) {
  return (
    <Link to={to} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
