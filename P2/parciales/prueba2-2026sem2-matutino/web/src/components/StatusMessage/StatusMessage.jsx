import styles from './StatusMessage.module.css';

/** Mensaje para los estados "cargando", "error" y "vacío".
 * `children` permite agregar cosas abajo (un botón de reintentar, un link).
 */
export default function StatusMessage({ type = 'info', text, children }) {
  return (
    <div className={`${styles.status} ${styles[type]}`} role={type === 'error' ? 'alert' : 'status'}>
      <p>{text}</p>
      {children}
    </div>
  );
}
