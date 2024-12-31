import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export const TablaEstudiantesTodos = () => {
  const [estudiantes, setEstudiantes] = useState([]); // Lista completa de estudiantes
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]); // Estudiantes filtrados
  const [isOpen, setIsOpen] = useState(false); // Modal de creación
  const [isEditOpen, setIsEditOpen] = useState(false); // Modal de edición
  const [newEstudiante, setNewEstudiante] = useState({
    Usuario: '',
    Contraseña: '',
    Nombres: '',
    Apellidos: '',
    Centro_ID: '',
    Año: ''
  }); // Datos para crear un estudiante
  const [selectedEstudiante, setSelectedEstudiante] = useState(null); // Estudiante seleccionado para editar

  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener todos los estudiantes
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4023/estudiantes');
      setEstudiantes(response.data);
      setFilteredEstudiantes(response.data); // Inicialmente, estudiantes filtrados son todos
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    }
  };

  // Función de búsqueda por nombre
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = estudiantes.filter(estudiante =>
      estudiante.Nombres.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEstudiantes(filtered);
  };

  // Función para manejar el cambio en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = (name === 'Centro_ID' || name === 'Año') ? Number(value) : value;
    const { message, isValid } = validateField(name, value);

    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
    if (isEditOpen) {
      setSelectedEstudiante({ ...selectedEstudiante, [name]: parsedValue });
    } else {
      setNewEstudiante({ ...newEstudiante, [name]: parsedValue });
    }
  };

  // Abrir/cerrar modal de creación
  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => {
    setIsOpen(false);
    setNewEstudiante({
      Usuario: '',
      Contraseña: '',
      Nombres: '',
      Apellidos: '',
      Centro_ID: '',
      Año: ''
    });
  };

  // Crear nuevo estudiante
  const handleCreateEstudiante = async () => {
    try {
      const response = await axios.post('http://localhost:4023/estudiantes', newEstudiante);
      setEstudiantes([...estudiantes, response.data]);
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
    }
  };

  // Abrir/cerrar modal de edición
  const handleEditModalOpen = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsEditOpen(true);
  };
  const handleEditModalClose = () => {
    setIsEditOpen(false);
    setSelectedEstudiante(null);
  };

  // Editar estudiante existente
  const handleEditEstudiante = async () => {
    try {
      const response = await axios.put(`http://localhost:4023/estudiantes/${selectedEstudiante.Estudiante_ID}`, selectedEstudiante);
      const updatedEstudiantes = estudiantes.map(estudiante =>
        estudiante.Estudiante_ID === selectedEstudiante.Estudiante_ID ? response.data : estudiante
      );
      setEstudiantes(updatedEstudiantes);
      setFilteredEstudiantes(updatedEstudiantes);
      handleEditModalClose();
      fetchData();
    } catch (error) {
      console.error('Error al editar el estudiante:', error);
    }
  };


//validar campos
// Validaciones
const [fieldMessages, setFieldMessages] = useState({});
const [fieldValidity, setFieldValidity] = useState({});

const validateField = (name, value) => {
  let message = "";
  let isValid = false;

  switch (name) {
    case "Nombres":
      if (!value) {
        message = "Este campo es obligatorio.";
      } else if (!/^[A-Z][a-záéíóúüñ]+(\s[A-Z][a-záéíóúüñ]+)*$/.test(value)) {
        message = "El nombre debe comenzar con mayúscula y solo contener letras (incluidos acentos).";
      } else if (value.length > 50) {
        message = "El nombre no puede exceder los 50 caracteres.";
      } else {
        isValid = true;
      }
      break;
    case "Apellidos":
      if (!value) {
        message = "Este campo es obligatorio.";
      } else if (!/^[A-Z][a-záéíóúüñ]+(\s[A-Z][a-záéíóúüñ]+)*$/.test(value)) {
        message = "El apellido debe comenzar con mayúscula y solo contener letras (incluidos acentos).";
      } else if (value.length > 50) {
        message = "El apellido no puede exceder los 50 caracteres.";
      } else {
        isValid = true;
      }
      break;
    case "Usuario":
      if (!value) {
        message = "El usuario es obligatorio.";
      } else if (value.length < 5) {
        message = "El usuario debe tener al menos 5 caracteres.";
      } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
        message = "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos.";
      } else {
        isValid = true;
      }
      break;
    case "Contraseña":
      if (!value) {
        message = "La contraseña es obligatoria.";
      } else if (value.length < 8) {
        message = "La contraseña debe tener al menos 8 caracteres.";
      } else if (!/[A-Z]/.test(value)) {
        message = "La contraseña debe contener al menos una letra mayúscula.";
      } else if (!/[a-z]/.test(value)) {
        message = "La contraseña debe contener al menos una letra minúscula.";
      } else if (!/[0-9]/.test(value)) {
        message = "La contraseña debe contener al menos un número.";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        message = "La contraseña debe contener al menos un carácter especial.";
      } else {
        isValid = true;
      }
      break;
    case "Centro_ID":
    case "Año":
      if (!value) {
        message = "Este campo es obligatorio.";
      } else if (isNaN(value) || value <= 0) {
        message = "Debe ser un número válido.";
      } else if (!Number.isInteger(Number(value))) {
        message = "Debe ser un número entero.";
      } else {
        isValid = true;
      }
      break;
    default:
      break;
  }

  return { message, isValid };
};



  // Eliminar estudiante
  const handleDeleteEstudiante = async (estudianteId) => {
    try {
      await axios.delete(`http://localhost:4023/estudiantes/${estudianteId}`);
      const updatedEstudiantes = estudiantes.filter(estudiante => estudiante.Estudiante_ID !== estudianteId);
      setEstudiantes(updatedEstudiantes);
      setFilteredEstudiantes(updatedEstudiantes);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
    }
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-9">
      {/* Barra de control encima de la tabla */}
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <div className="flex items-center gap-2">
          <Input
            clearable
            placeholder="Buscar por nombre..."
            className="w-60"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={handleModalOpen} color="primary"><FontAwesomeIcon icon={faAdd} /></Button>
      </div>

      <Divider className="my-1" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto " style={{ marginTop: "20px" }}>
        {filteredEstudiantes.length > 0 ? (
          <table  className="w-full border relative">
            <thead  className=" shadow-xl w-full  max-w-7xl  z-20 bg-blue-50 " >
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombres</th>
                <th className="border p-2">Apellidos</th>
                <th className="border p-2">Usuario</th>
                <th className="border p-2">Contraseña</th>
                <th className="border p-2">Centro ID</th>
                <th className="border p-2">Año</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody >
              {filteredEstudiantes.map((estudiante) => (
                <tr key={estudiante.Estudiante_ID}>
                  <td className="border p-2">{estudiante.Estudiante_ID}</td>
                  <td className="border p-2">{estudiante.Nombres}</td>
                  <td className="border p-2">{estudiante.Apellidos}</td>
                  <td className="border p-2">{estudiante.Usuario}</td>
                  <td className="border p-2">{estudiante.Contraseña}</td>
                  <td className="border p-2">{estudiante.Centro_ID}</td>
                  <td className="border p-2">{estudiante.Año}</td>
                  <td className="border p-2">
                    <div className="flex justify-center space-x-2">
                      <Tooltip content='Los cambios son permanentes' color="danger" variant="light">

                      <Button onClick={() => handleDeleteEstudiante(estudiante.Estudiante_ID)} color="danger" variant="light">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                      </Tooltip>

                      <Button onClick={() => handleEditModalOpen(estudiante)} color="warning" variant="light">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron estudiantes. <Spinner /></p>
        )}
      </div>

      {/* Modal para crear nuevo estudiante */}
      <Modal isOpen={isOpen} onOpenChange={handleModalClose}>
        <ModalContent>
          <ModalHeader>Crear Nuevo Estudiante</ModalHeader>
          <ModalBody>
  <Input
    name="Nombres"
    label="Nombres"
    placeholder="Ingrese los nombres del estudiante"
    value={selectedEstudiante?.Nombres || newEstudiante.Nombres}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Nombres === true
        ? "success"
        : fieldValidity.Nombres === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Nombres}</small>

  <Input
    name="Apellidos"
    label="Apellidos"
    placeholder="Ingrese los apellidos del estudiante"
    value={selectedEstudiante?.Apellidos || newEstudiante.Apellidos}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Apellidos === true
        ? "success"
        : fieldValidity.Apellidos === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Apellidos}</small>

  <Input
    name="Usuario"
    label="Usuario"
    placeholder="Ingrese el usuario del estudiante"
    value={selectedEstudiante?.Usuario || newEstudiante.Usuario}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Usuario === true
        ? "success"
        : fieldValidity.Usuario === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Usuario}</small>

  <Input
    name="Contraseña"
    label="Contraseña"
    placeholder="Ingrese la contraseña del estudiante"
    type="password"
    value={selectedEstudiante?.Contraseña || newEstudiante.Contraseña}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Contraseña === true
        ? "success"
        : fieldValidity.Contraseña === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Contraseña}</small>

  <Input
    name="Centro_ID"
    label="Centro ID"
    placeholder="Ingrese el ID del centro al que pertenece el estudiante"
    type="number"
    value={selectedEstudiante?.Centro_ID || newEstudiante.Centro_ID}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Centro_ID === true
        ? "success"
        : fieldValidity.Centro_ID === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Centro_ID}</small>

  <Input
    name="Año"
    label="Año"
    placeholder="Ingrese el año del estudiante"
    type="number"
    value={selectedEstudiante?.Año || newEstudiante.Año}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Año === true
        ? "success"
        : fieldValidity.Año === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Año}</small>
</ModalBody>

          <ModalFooter>
            <Button color="danger" variant="flat" onClick={handleModalClose}>Cerrar</Button>
            <Button color="primary" onClick={handleCreateEstudiante}>Crear Estudiante</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar estudiante existente */}
      <Modal isOpen={isEditOpen} onOpenChange={handleEditModalClose}>
        <ModalContent>
          <ModalHeader>Editar Estudiante</ModalHeader>
          <ModalBody>
  <Input
    name="Nombres"
    label="Nombres"
    placeholder="Ingrese los nombres del estudiante"
    value={selectedEstudiante?.Nombres || newEstudiante.Nombres}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Nombres === true
        ? "success"
        : fieldValidity.Nombres === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Nombres}</small>

  <Input
    name="Apellidos"
    label="Apellidos"
    placeholder="Ingrese los apellidos del estudiante"
    value={selectedEstudiante?.Apellidos || newEstudiante.Apellidos}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Apellidos === true
        ? "success"
        : fieldValidity.Apellidos === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Apellidos}</small>

  <Input
    name="Usuario"
    label="Usuario"
    placeholder="Ingrese el usuario del estudiante"
    value={selectedEstudiante?.Usuario || newEstudiante.Usuario}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Usuario === true
        ? "success"
        : fieldValidity.Usuario === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Usuario}</small>

  <Input
    name="Contraseña"
    label="Contraseña"
    placeholder="Ingrese la contraseña del estudiante"
    type="password"
    value={selectedEstudiante?.Contraseña || newEstudiante.Contraseña}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Contraseña === true
        ? "success"
        : fieldValidity.Contraseña === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Contraseña}</small>

  <Input
    name="Centro_ID"
    label="Centro ID"
    placeholder="Ingrese el ID del centro al que pertenece el estudiante"
    type="number"
    value={selectedEstudiante?.Centro_ID || newEstudiante.Centro_ID}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Centro_ID === true
        ? "success"
        : fieldValidity.Centro_ID === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Centro_ID}</small>

  <Input
    name="Año"
    label="Año"
    placeholder="Ingrese el año del estudiante"
    type="number"
    value={selectedEstudiante?.Año || newEstudiante.Año}
    onChange={handleInputChange}
    variant="bordered"
    color={
      fieldValidity.Año === true
        ? "success"
        : fieldValidity.Año === false
        ? "danger"
        : "default"
    }
  />
  <small className="text-red-500">{fieldMessages.Año}</small>
</ModalBody>

          <ModalFooter>
            <Button color="danger" variant="flat" onClick={handleEditModalClose}>Cerrar</Button>
            <Button color="primary" onClick={handleEditEstudiante}>Guardar Cambios</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
