import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import '../../assets/fondo.css'; // Ajusta la ruta según la ubicación del archivo CSS

export const TablaEvaluacionesTodosAdmin = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedNota, setSelectedNota] = useState(null);
  const [newNota, setNewNota] = useState(""); // Campo para almacenar la nueva nota

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4023/estudiantes/Notas/Todos");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error al obtener los estudiantes con notas:", error);
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

  const openModal = (student, nota) => {
    setSelectedStudent(student);
    setSelectedNota(nota);
    setNewNota(nota.Nota); // Inicializar el valor de la nota en el modal
    onOpen();
  };


  //validaciones
  // Validaciones
  const [fieldMessages, setFieldMessages] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});

  const validateField = (name, value) => {
    let message = "";
    let isValid = false;

    switch (name) {
      case "Nueva Nota":
        if (!value) {
          message = "Este campo es obligatorio.";
        } else if (isNaN(value)) {
          message = "Debe ser un número válido.";
        } else if (value < 2 || value > 5) {
          message = "El número debe estar en el rango de 2 a 5.";
        } else {
          isValid = true;
        }
        break;
      default:
        break;
    }

    return { message, isValid };
  };

  // Manejo del cambio
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const { message, isValid } = validateField(name, value);

    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
  };



  const handleNotaChange = async () => {
    try {
      await axios.put(
        "http://localhost:4023/notas", // Endpoint de actualización
        { Nota: newNota }, // Cuerpo de la solicitud
        {
          params: {
            estudianteId: selectedStudent.Estudiante_ID,
            NotaId: selectedNota.Nota_ID,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStudents((prev) =>
        prev.map((student) =>
          student.Estudiante_ID === selectedStudent.Estudiante_ID
            ? {
              ...student,
              notas: student.notas.map((nota) =>
                nota.Nota_ID === selectedNota.Nota_ID
                  ? { ...nota, Nota: newNota }
                  : nota
              ),
            }
            : student
        )
      );

      await fetchData();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
    }
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12">
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
          <table className="w-full border overflow-x-auto">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombres</th>
                <th className="border border-gray-300 p-2">Apellidos</th>
                <th className="border border-gray-300 p-2">Año</th>
                <th className="border border-gray-300 p-2">Usuario</th>
                {filteredStudents[0]?.notas.length > 0 && (
                  filteredStudents[0].notas.map((nota) => (
                    <th key={nota.Nota_ID} className="border border-gray-300 p-2">
                      Nota
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
                        <Button color="default" variant="light" onPress={() => openModal(student, nota)}>
                          {nota.Nota}
                        </Button>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h4>Cambiar Nota</h4>
              </ModalHeader>
              <ModalBody>
                <p>Introduce la nueva nota para {selectedStudent?.Nombres} {selectedStudent?.Apellidos}:</p>
                <Input
                  name="Nueva Nota"
                  placeholder="Nueva Nota"
                  type="number"
                  value={newNota}
                  onChange={(e) => {
                    setNewNota(e.target.value);
                    handleInputChange(e);
                  }}
                  variant="bordered"
                  color={
                    fieldValidity["Nueva Nota"] === true
                      ? "success"
                      : fieldValidity["Nueva Nota"] === false
                        ? "danger"
                        : "default"
                  }
                />
                <small className="text-red-500">{fieldMessages["Nueva Nota"]}</small>

              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleNotaChange}>
                  Guardar
                </Button>
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
