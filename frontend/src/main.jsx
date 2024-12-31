import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NextUIProvider } from '@nextui-org/react'

//se hizo cambios para aniadir la store a la aplicacion
import { Provider } from 'react-redux'
import { store } from './storeCurso/Store.jsx'


createRoot(document.getElementById('root')).render(
<Provider store={store}>

      <NextUIProvider>
      <App />
    </NextUIProvider>
</Provider>
  
)
