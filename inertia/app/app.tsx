/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import '../css/nucleo-icons.css'
import '../css/nucleo-svg.css'
import '../css/soft-ui-dashboard.css'
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap'
import '../css/popper.css'
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StoreProvider } from '~/context/store';

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'
const queryClient = new QueryClient()
createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    
    createRoot(el).render(<QueryClientProvider client={queryClient}><StoreProvider><App {...props} /></StoreProvider></QueryClientProvider>);
    
  },
});