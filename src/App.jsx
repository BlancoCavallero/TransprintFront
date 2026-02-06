import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import './global.css'
import {UsuarioProvider} from './context/UsuarioProvider'


const App = () => {
  return (
    <>
      <UsuarioProvider>
        <AppRoutes></AppRoutes>
        <Toaster position="top-right" expand={false} richColors />
      </UsuarioProvider>
    </>
  );
};

export default App;
