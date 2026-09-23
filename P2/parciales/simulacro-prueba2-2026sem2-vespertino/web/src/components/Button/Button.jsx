import styles from './Button.module.css';

// Botón con las dos variantes del diseño. El resto de las props
// (onClick, type, disabled…) se pasan tal cual al <button>.
export default function Button({ variant = 'secondary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      {...props}
    />
  );
}
