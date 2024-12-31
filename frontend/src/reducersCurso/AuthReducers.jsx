import { types } from "../typesCurso/types";
//este reducer gestiona la autenticacion  
export const AuthReducers = (state = {}, action) => {
    switch (action.type) {
        case types.loginCurso:
            return {
                uid: action.payload.uid,
                name: action.payload.displayName,
            };
        case types.logout:
            return {};
        default:
            return state; // Retorna el estado actual
    }
};
