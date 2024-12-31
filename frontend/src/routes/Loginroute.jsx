import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Input } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import { loginCurso } from '../ActionsCurso/actions';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ usuario: '', contrasenia: '' });
  const [userType, setUserType] = useState('estudiante');
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    Usuario: '',
    Contraseña: '',
    Año: new Date().getFullYear(),
    Nombres: '',
    Apellidos: ''
  });
  const [errors, setErrors] = useState({
    Usuario: '',
    Contraseña: '',
    Nombres: '',
    Apellidos: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const validateInput = (name, value) => {
    if (name === 'Nombres' || name === 'Apellidos' || name === 'Usuario') {
      return /^[A-Z][a-zA-Z\s]*$/.test(value) ? '' : 'Debe iniciar con mayúscula, sin números ni símbolos.';
    } else if (name === 'Contraseña') {
      return /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(value)
        ? ''
        : 'Debe tener al menos 6 caracteres, una mayúscula y un símbolo.';
    }
    return '';
  };

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setNewAccountData({ ...newAccountData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };


  ///cursooooooooo
//dispatch

const dispatch = useDispatch()


  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(credentials, userType);
    if (!success) setError(true);
    dispatch( loginCurso( 1234, 'pepe' ))

  };

  const handleCreateAccount = async () => {
    const hasErrors = Object.values(errors).some((err) => err !== '');
    if (hasErrors) {
      alert("Corrige los errores antes de crear la cuenta.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4023/estudiantes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccountData)
      });
      if (response.ok) {
        alert("Cuenta creada con éxito");
        setShowModal(false);
      } else {
        alert("Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Iniciar Sesión
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-900">
              Tipo de usuario
            </label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-900">
              Usuario
            </label>
            <div className="mt-2">
              <Input
                id="usuario"
                name="usuario"
                type="text"
                value={credentials.usuario}
                onChange={handleInputChange}
                required
                className="block w-full rounded-xl text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contrasenia" className="block text-sm font-medium">
              Contraseñan
            </label>
            <div className="mt-2">
              <Input
                id="contrasenia"
                name="contrasenia"
                type="password"
                value={credentials.contrasenia}
                onChange={handleInputChange}
                required
                className="block w-full rounded-xl text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm mt-2">
              Error en la autenticación. Verifica tus credenciales.
            </p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        {userType === 'estudiante' && (
          <p className="text-center mt-4">
            ¿No tienes una cuenta?{" "}
            <span
              onClick={() => setShowModal(true)}
              className="text-blue-600 cursor-pointer"
            >
              Crear una cuenta
            </span>
          </p>
        )}
      </div>

      {/* Modal de creación de cuenta */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Crear Cuenta de Estudiante</h2>
            <form className="space-y-4">
              <Input
                label="Usuario"
                name="Usuario"
                value={newAccountData.Usuario}
                onChange={handleNewAccountChange}
                required
                isInvalid={!!errors.Usuario}
                color={errors.Usuario ? "danger" : "default"}
                errorMessage={errors.Usuario || ""}
              />
              <Input
                label="Contraseña"
                name="Contraseña"
                type="password"
                value={newAccountData.Contraseña}
                onChange={handleNewAccountChange}
                required
                isInvalid={!!errors.Contraseña}
                color={errors.Contraseña ? "danger" : "default"}
                errorMessage={errors.Contraseña || ""}
              />
              <Input
                label="Año"
                name="Año"
                type="number"
                value={newAccountData.Año}
                onChange={handleNewAccountChange}
                required
              />
              <Input
                label="Nombres"
                name="Nombres"
                value={newAccountData.Nombres}
                onChange={handleNewAccountChange}
                required
                isInvalid={!!errors.Nombres}
                color={errors.Nombres ? "danger" : "default"}
                errorMessage={errors.Nombres || ""}
              />
              <Input
                label="Apellidos"
                name="Apellidos"
                value={newAccountData.Apellidos}
                onChange={handleNewAccountChange}
                required
                isInvalid={!!errors.Apellidos}
                color={errors.Apellidos ? "danger" : "default"}
                errorMessage={errors.Apellidos || ""}
              />
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full bg-indigo-600 text-white py-2 rounded-md"
              >
                Crear Cuenta
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full mt-2 bg-gray-400 text-white py-2 rounded-md"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
