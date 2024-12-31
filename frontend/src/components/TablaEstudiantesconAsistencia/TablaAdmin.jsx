import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import '../../assets/fondo.css'; // Ajusta la ruta según la ubicación del archivo CSS

export const TablaAdminTodosEstudiantesConAsistencia = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Manejador de visibilidad del modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);

  useEffect(() => {
    

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4023/estudiantes/Asistencia/Todos");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = students.filter((student) =>
      student.Nombres.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const openModal = (student, asistencia) => {
    setSelectedStudent(student);
    setSelectedAsistencia(asistencia);
    onOpen(); // Abre el modal usando `onOpen`
  };

  const handleAsistenciaChange = async (newAsistencia) => {
    try {
      await axios.put(
        "http://localhost:4023/asistencia",
        { Asistencia: newAsistencia }, // cuerpo de la solicitud
        {
          params: {
            estudianteId: selectedStudent.Estudiante_ID,
            asistenciaId: selectedAsistencia.Asistencia_ID,
          },
          headers: {
            "Content-Type": "application/json", // header de tipo de contenido
          },
        }
      );
  
      // Actualizar el estado después de una actualización exitosa
      setStudents((prev) =>
        prev.map((student) =>
          student.Estudiante_ID === selectedStudent.Estudiante_ID
            ? {
                ...student,
                asistencias: student.asistencias.map((asistencia) =>
                  asistencia.Asistencia_ID === selectedAsistencia.Asistencia_ID
                    ? { ...asistencia, Asistencia: newAsistencia }
                    : asistencia
                ),
              }
            : student
        )
      );
      await fetchData()
      onOpenChange(false); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
    }
  };
  

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12 ">
      <div className="flex justify-between items-center w-full max-w-7xl m-6">
        <Input
          clearable
          placeholder="Buscar..."
          className="w-60"
          value={searchTerm}
          onChange={handleSearch}
        />
        
      </div>

      <Divider className="my-1" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredStudents.length > 0 ? (
          <table className="w-full border overflow-x-auto ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombres</th>
                <th className="border border-gray-300 p-2">Apellidos</th>
                <th className="border border-gray-300 p-2">Año</th>
                <th className="border border-gray-300 p-2">Usuario</th>
                {filteredStudents[0]?.asistencias.map((asistencia) => (
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
                      <Button color="default" variant="light" onPress={() => openModal(student, asistencia)}>
                        {asistencia.Asistencia}
                      </Button>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h4>Cambiar Asistencia</h4>
              </ModalHeader>
              <ModalBody>
                <p>Selecciona el estado de asistencia para {selectedStudent?.Nombres} {selectedStudent?.Apellidos}:</p>
                <div className="flex gap-2 justify-center">
                  <Button onPress={() => handleAsistenciaChange("Si")} color="success">
                    Sí
                  </Button>
                  <Button onPress={() => handleAsistenciaChange("No")} color="danger">
                    No
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
