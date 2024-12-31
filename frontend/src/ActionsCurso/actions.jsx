import { types } from "../typesCurso/types"


export const loginCurso =(uid , displayName) =>{
    
    console.log('loguin curso' , uid , displayName);
    return {

        type : types.loginCurso,
        payload: {
            uid ,
            displayName
        }
    }
} 