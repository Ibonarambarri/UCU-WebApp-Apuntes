import styles from './Header.module.css';

// Título fijo de la app + subtítulo opcional con el nombre de la página
// (en el diseño: "TicTacToe" / "Play" / "Players"; el home no tiene subtítulo).
export default function Header({ title = 'TicTacToe', subtitle }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
    </header>
  );
}
