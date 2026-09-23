import Header from '../../components/Header/Header.jsx';
import LinkButton from '../../components/Button/LinkButton.jsx';
import styles from './PageHome.module.css';

export default function PageHome() {
  return (
    <div className={styles.page}>
      <Header />
      <nav className={styles.menu}>
        <LinkButton to="/play" variant="primary">Play</LinkButton>
        <LinkButton to="/players">Players</LinkButton>
      </nav>
    </div>
  );
}
