import { AppRoutes } from './routes/AppRoutes';
import './global.css'
import {UsuarioProvider} from './context/UsuarioProvider'


const App = () => {
  return (
    <>
      <UsuarioProvider>
        <AppRoutes></AppRoutes>
      </UsuarioProvider>
    </>
  );
};

export default App;
