import styles from './Header.module.css';

export default function Header({ title, children }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
}
