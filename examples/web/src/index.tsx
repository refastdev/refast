import { Refast } from '@refastdev/refast';
import { pages } from '@refastdev/refast/routes';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routesOption={{ pages }} />);
