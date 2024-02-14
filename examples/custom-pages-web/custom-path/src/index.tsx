import { Refast } from '@refastdev/refast';
import { createRoot } from 'react-dom/client';

import { pages } from './routes';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routesOption={{ pages }} />);
