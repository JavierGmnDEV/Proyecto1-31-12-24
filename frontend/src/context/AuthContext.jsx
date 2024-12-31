// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Crear el proveedor del contexto
export const AuthProvider = ({ children  }) => {
    const [user, setUser] = useState(null); // Estado del usuario autenticado
    const navigate = useNavigate(); // Hook para redirigir programáticamente

    // Al cargar el componente, verificar si hay un usuario en localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Si existe, cargarlo en el estado
        }
    }, []);

    // Función de login que selecciona la URL en función del tipo de usuario
    const login = async (credentials, userType) => {
        try {
            // Determinar la URL del endpoint según el tipo de usuario
            let url = 'http://localhost:4023/login';
            if (userType === 'profesor') url = 'http://localhost:4023/login/profesor';
            if (userType === 'estudiante') url = 'http://localhost:4023/login/estudiante';
            if (userType === 'administrador') url = 'http://localhost:4023/login/administrador';

            // Hacer la petición al backend con Axios
            const response = await axios.post(url, null, {
                params: {
                    usuario: credentials.usuario,
                    contrasenia: credentials.contrasenia
                }
            });

            // Guardar el usuario en el estado y en Local Storage si la autenticación es exitosa
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // Redirigir según el tipo de usuario
            if (userType === 'profesor') navigate('/Profesor/Estudiantes');
            else if (userType === 'estudiante') navigate('/Estudiantes/Plan');
            else if (userType === 'administrador') navigate('/Admin/Administracion');

            return true; // Retornar true si el login fue exitoso
        } catch (error) {
            
            console.error('Error de autenticación',error );
            return false; // Retornar false si hubo un error
        }
    };

    // Función de logout que limpia el estado de usuario y el Local Storage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login'); // Redirigir al usuario a la página de login tras cerrar sesión
    };

    // Proveer los valores y funciones del contexto a la aplicación
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Exportar el contexto para usarlo en otros componentes
export default AuthContext;
