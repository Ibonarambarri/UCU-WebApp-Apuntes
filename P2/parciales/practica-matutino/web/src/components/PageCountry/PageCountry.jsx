import { useParams } from 'react-router-dom';
import Header from '../Header/Header.jsx';

export default function PageCountry() {
  const { code } = useParams();

  // TODO Detalle del país: datos, favorito y países limítrofes navegables.
  return (
    <div>
      <Header title={`Países / ${code}`} />
      <p>Pendiente de implementar.</p>
    </div>
  );
}
