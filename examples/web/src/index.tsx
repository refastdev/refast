import { Refast } from '@refastdev/refast';
import { createRoot } from 'react-dom/client';

import { pages } from '../node_modules/.refast/routes';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routesOption={{ pages }} />);
