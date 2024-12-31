import { Divider, Input } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";

export const EstudiantesAsistencias = () => {
  const { user,  } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:4023/estudiantes/Asistencia?centroId=${user.centro_id}&anio=${user.anio}`, {
        method: "GET",
        redirect: "follow",
      });
      const result = await response.json();
      setStudents(result);
      setFilteredStudents(result);
    } catch (error) {
      console.error("Error al obtener los estudiantes con asistencia:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = students.filter((student) =>
      student.Nombres.toLowerCase().includes(value) ||
      student.Apellidos.toLowerCase().includes(value) ||
      student.Usuario.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12">
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <Input
          type="text"
          placeholder="Buscar por nombre, apellido o usuario..."
          className="w-60 p-2 border rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Divider className="my-2" />

      <div className="w-full max-w-7xl text-center my-5">
          <h2 className="text-xl font-bold">Listado de Asistencias</h2>
          
        </div>
        <Divider className="my-2" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredStudents.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombres</th>
                <th className="border border-gray-300 p-2">Apellidos</th>
                <th className="border border-gray-300 p-2">Año</th>
                <th className="border border-gray-300 p-2">Usuario</th>
                {filteredStudents[0]?.asistencias?.map((asistencia) => (
                  <th key={asistencia.Asistencia_ID} className="border border-gray-300 p-2">
                    Asistencia/{new Date(asistencia.Fecha).toLocaleDateString()}
                  </th>
                ))}
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
                  {student.asistencias.map((asistencia) => (
                    <td key={asistencia.Asistencia_ID} className="border border-gray-300 p-2">
                      {asistencia.Asistencia}
                    </td>
                  ))}
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
