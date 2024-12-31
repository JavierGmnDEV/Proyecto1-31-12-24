

import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AuthContext from "../../../context/AuthContext";

export const ProfesorEstudiantes = () => {
  const { user, } = useContext(AuthContext);

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
  const [centro, setCentro] = useState(null); // Estado para almacenar los datos del centro

  useEffect(() => {
    fetchData();
    fetchCentro();
  }, []);

  // Función para obtener todos los estudiantes
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4023/estudiantes?centroId=${user.centro_id}&anio=${user.anio}`);

      setEstudiantes(response.data);
      setFilteredEstudiantes(response.data); // Inicialmente, estudiantes filtrados son todos
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
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

    // Actualizar estado de mensajes y validez
    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));

    // Actualizar datos del formulario
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


  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "Usuario": {
        const isValid = value.trim().length > 0;
        return {
          isValid,
          message: isValid ? "" : "El usuario es obligatorio",
        };
      }

      case "Contraseña": {
        const isValid = value.length >= 6;
        return {
          isValid,
          message: isValid
            ? ""
            : "La contraseña debe tener al menos 6 caracteres",
        };
      }

      case "Nombres": {
        const isValid = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value);
        return {
          isValid,
          message: isValid
            ? ""
            : "El nombre debe comenzar con mayúscula y solo contener letras",
        };
      }

      case "Apellidos": {
        const isValid = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value);
        return {
          isValid,
          message: isValid
            ? ""
            : "El apellido debe comenzar con mayúscula y solo contener letras",
        };
      }

      case "Año": {
        const isValid = Number(value) >= 2 && Number(value) <= 5;
        return {
          isValid,
          message: isValid
            ? ""
            : "El año debe estar entre 2 y 5",
        };
      }



      default:
        return {
          isValid: false,
          message: "Campo no reconocido",
        };
    }
  };

  const [fieldMessages, setFieldMessages] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});


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
      {/* Nombre del Centro */}
      {centro && (
        <div className="w-full max-w-7xl text-center my-5">
          <h2 className="text-xl font-bold">Centro: {centro.Nombre}</h2>
          <p>{centro.Descripcion} - {centro.Lugar}</p>
        </div>
      )}
      <Divider className="my-2" />
      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto " style={{ marginTop: "20px" }}>
        {filteredEstudiantes.length > 0 ? (
          <table className="w-full border relative">
            <thead className=" shadow-xl w-full  max-w-7xl  z-20 bg-blue-50 " >
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
            {/* Usuario */}
            <Input
              name="Usuario"
              label="Usuario"
              placeholder="Ingrese usuario"
              value={newEstudiante.Usuario || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Usuario === true
                  ? "success"
                  : fieldValidity.Usuario === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Usuario}</small>

            {/* Contraseña */}
            <Input
              name="Contraseña"
              label="Contraseña"
              type="password"
              placeholder="Ingrese contraseña"
              value={newEstudiante.Contraseña || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Contraseña === true
                  ? "success"
                  : fieldValidity.Contraseña === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Contraseña}</small>

            {/* Nombres */}
            <Input
              name="Nombres"
              label="Nombres"
              placeholder="Ingrese nombres"
              value={newEstudiante.Nombres || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Nombres === true
                  ? "success"
                  : fieldValidity.Nombres === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Nombres}</small>

            {/* Apellidos */}
            <Input
              name="Apellidos"
              label="Apellidos"
              placeholder="Ingrese apellidos"
              value={newEstudiante.Apellidos || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Apellidos === true
                  ? "success"
                  : fieldValidity.Apellidos === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Apellidos}</small>

            {/* Centro_ID */}
            <Input
            readOnly
              name="Centro_ID"
              label="Centro ID"
              type="number"
              placeholder="Ingrese centro ID"
              value={user.centro_id}
              onChange={handleInputChange}
              color={
                fieldValidity.Centro_ID === true
                  ? "success"
                  : fieldValidity.Centro_ID === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Centro_ID}</small>

            {/* Año */}
            <Input
              name="Año"
              label="Año"
              type="number"
              placeholder="Ingrese año"
              value={newEstudiante.Año || ""}
              onChange={handleInputChange}
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
            <Button color="danger" variant="flat" onClick={handleModalClose}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleCreateEstudiante}>
              Crear Estudiante
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar estudiante existente */}
      <Modal isOpen={isEditOpen} onOpenChange={handleEditModalClose}>
        <ModalContent>
          <ModalHeader>Editar Estudiante</ModalHeader>
          <ModalBody>
            {/* Usuario */}
            <Input
              name="Usuario"
              label="Usuario"
              placeholder="Ingrese usuario"
              value={selectedEstudiante?.Usuario || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Usuario === true
                  ? "success"
                  : fieldValidity.Usuario === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Usuario}</small>

            {/* Contraseña */}
            <Input
              name="Contraseña"
              label="Contraseña"
              type="password"
              placeholder="Ingrese contraseña"
              value={selectedEstudiante?.Contraseña || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Contraseña === true
                  ? "success"
                  : fieldValidity.Contraseña === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Contraseña}</small>

            {/* Nombres */}
            <Input
              name="Nombres"
              label="Nombres"
              placeholder="Ingrese nombres"
              value={selectedEstudiante?.Nombres || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Nombres === true
                  ? "success"
                  : fieldValidity.Nombres === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Nombres}</small>

            {/* Apellidos */}
            <Input
              name="Apellidos"
              label="Apellidos"
              placeholder="Ingrese apellidos"
              value={selectedEstudiante?.Apellidos || ""}
              onChange={handleInputChange}
              color={
                fieldValidity.Apellidos === true
                  ? "success"
                  : fieldValidity.Apellidos === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Apellidos}</small>

            {/* Centro_ID */}
            <Input
            readOnly
              name="Centro_ID"
              label="Centro ID"
              type="number"
              placeholder="Ingrese centro ID"
              value={user.centro_id}
              onChange={handleInputChange}
              color={
                fieldValidity.Centro_ID === true
                  ? "success"
                  : fieldValidity.Centro_ID === false
                    ? "danger"
                    : "default"
              }
            />
            <small className="text-red-500">{fieldMessages.Centro_ID}</small>

            {/* Año */}
            <Input
              name="Año"
              label="Año"
              type="number"
              placeholder="Ingrese año"
              value={selectedEstudiante?.Año || ""}
              onChange={handleInputChange}
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
            <Button color="danger" variant="flat" onClick={handleEditModalClose}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleEditEstudiante}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};
