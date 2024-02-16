import { Refast } from '@refastdev/refast';
import { createRoot } from 'react-dom/client';

import { routes } from './routes';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routes={routes} />);
