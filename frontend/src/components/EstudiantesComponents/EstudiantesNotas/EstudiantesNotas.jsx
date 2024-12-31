import { Divider, Input } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";

export const EstudiantesNotas = () => {
  const { user,  } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:4023/estudiantes/Notas?centroId=${user.centro_id}&anio=${user.anio}`, {
        method: 'GET',
        redirect: 'follow'
      });
      const result = await response.json();
      setStudents(result);
      
      setFilteredStudents(result); // Inicializamos los estudiantes filtrados
    } catch (error) {
      console.error("Error al obtener los estudiantes con notas:", error);
    }
  };

  // Filtrado de estudiantes según el término de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = students.filter((student) =>
      student.Nombres.toLowerCase().includes(value.toLowerCase()) ||
      student.Apellidos.toLowerCase().includes(value.toLowerCase()) ||
      student.Usuario.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12">
      
      <div className="flex justify-between items-center w-full max-w-7xl m-6">
        <Input
          type="text"
          placeholder="Buscar por nombres, apellidos o usuario..."
          className="w-60 p-2 border rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Divider className="my-2" />

      <div className="w-full max-w-7xl text-center my-5">
          <h2 className="text-xl font-bold">Listado de Notas</h2>
          
        </div>
        <Divider className="my-2" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredStudents.length > 0 ? (
          <table className="w-full border overflow-x-auto">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombres</th>
                <th className="border border-gray-300 p-2">Apellidos</th>
                <th className="border border-gray-300 p-2">Año</th>
                <th className="border border-gray-300 p-2">Usuario</th>
                {filteredStudents[0]?.notas?.length > 0 && (
                  filteredStudents[0].notas.map((nota) => (
                    <th key={nota.Nota_ID} className="border border-gray-300 p-2">
                      {nota.Nombre_Evaluacion}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.Estudiante_ID}>
                  <td className="border border-gray-300 p-2">{student.Estudiante_ID}</td>
                  <td className="border border-gray-300 p-2">{student.Nombres}</td>
                  <td className="border border-gray-300 p-2">{student.Apellidos}</td>
                  <td className="border border-gray-300 p-2">{student.Año}</td>
                  <td className="border border-gray-300 p-2">{student.Usuario}</td>
                  {student.notas.length > 0 ? (
                    student.notas.map((nota) => (
                      <td key={nota.Nota_ID} className="border border-gray-300 p-2">
                        {nota.Nota}
                      </td>
                    ))
                  ) : (
                    <td className="border border-gray-300 p-2" colSpan={student.notas.length || 1}>
                      Sin notas registradas
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron estudiantes.</p>
        )}
      </div>
    </div>
  );
};
