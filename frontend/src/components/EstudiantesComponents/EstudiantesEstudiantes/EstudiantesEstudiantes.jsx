import { useContext, useEffect, useState } from "react";
import { Input, Divider, Spinner } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";

export const EstudiantesEstudiantes = () => {
  const { user,  } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [centro, setCentro] = useState(null); // Estado para almacenar los datos del centro

  useEffect(() => {
    fetchEstudiantes();
    fetchCentro();
  }, []);

  // Función para obtener estudiantes desde el backend
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`http://localhost:4023/estudiantes?centroId=${user.centro_id}&anio=${user.anio}`);
      const data = await response.json();
      setEstudiantes(data);
      setFilteredEstudiantes(data);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  };

  // Función para obtener datos del centro
  const fetchCentro = async () => {
    try {
      const response = await fetch(`http://localhost:4023/centro/${user.centro_id}`);
      const data = await response.json();
      setCentro(data); // Guardamos los datos del centro en el estado
    } catch (error) {
      console.error("Error al obtener el centro:", error);
    }
  };

  // Función para manejar el filtro de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = estudiantes.filter((estudiante) =>
      estudiante.Nombres.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEstudiantes(filtered);
  };

  return (
    <div className="flex flex-col items-center h-screen p-9 background-image-blue">
      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <Input
          clearable
          placeholder="Buscar por nombre..."
          className="w-60"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Divider className="my-1" />

      {/* Nombre del Centro */}
      {centro && (
        <div className="w-full max-w-7xl text-center my-5">
          <h2 className="text-xl font-bold">Centro: {centro.Nombre}</h2>
          <p>{centro.Descripcion} - {centro.Lugar}</p>
        </div>
      )}
<Divider className="my-2" />

      {/* Tabla de estudiantes */}
      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto mt-5">
        {filteredEstudiantes.length > 0 ? (
          <table className="w-full border">
            <thead className="bg-blue-50 shadow-xl">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombres</th>
                <th className="border p-2">Apellidos</th>
                <th className="border p-2">Usuario</th>
                <th className="border p-2">Centro ID</th>
                <th className="border p-2">Año</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstudiantes.map((estudiante) => (
                <tr key={estudiante.Estudiante_ID}>
                  <td className="border p-2">{estudiante.Estudiante_ID}</td>
                  <td className="border p-2">{estudiante.Nombres}</td>
                  <td className="border p-2">{estudiante.Apellidos}</td>
                  <td className="border p-2">{estudiante.Usuario}</td>
                  <td className="border p-2">{estudiante.Centro_ID}</td>
                  <td className="border p-2">{estudiante.Año}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron estudiantes. <Spinner /></p>
        )}
      </div>
    </div>
  );
};
