import { Refast } from '@refastdev/refast';
import { createRoot } from 'react-dom/client';

import { customPagesOption } from './option';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routerOption={{ customPagesOption }} />);
