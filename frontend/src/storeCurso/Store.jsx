import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { AuthReducers } from '../reducersCurso/AuthReducers';

//para usar varios reducers

export const variosReducers = combineReducers({
    auth: AuthReducers,//se le pone el nombre que quieras 
    
});

export const store = configureStore({
    reducer: variosReducers, //se le pasa el arreglo de los reducers que se estan usando 
    devTools: true, // Habilita Redux DevTools para depuración
});
