import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export const TablaAdminTodosProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfesores, setFilteredProfesores] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [newProfesor, setNewProfesor] = useState({
    Usuario: '',
    Contraseña: '',
    Nombres: '',
    Apellidos: '',
    Centro_ID: '',
    Año: '',
    Rol: ''
  });

  const [selectedProfesor, setSelectedProfesor] = useState(null);

  useEffect(() => {

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4023/profesor');
      const data = response.data;
      setProfesores(data);
      setFilteredProfesores(data);
    } catch (error) {
      console.error('Error al obtener los profesores:', error);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = profesores.filter(profesor =>
      profesor.Nombres.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProfesores(filtered);
  };


  //  validaciones
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
      case "Rol":
        if (!value) {
          message = "El rol es obligatorio.";
        } else if (!/^(Docente|Ayudante)$/.test(value)) {
          message = "El rol debe ser Docente o Ayudante.";
        } else {
          isValid = true;
        }
        break;
      default:
        break;
    }

    return { message, isValid };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "Centro_ID" || name === "Año" ? Number(value) : value;

    // Validar el campo al escribir
    const { message, isValid } = validateField(name, parsedValue);

    // Actualizar estado de validación
    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));

    // Actualizar el estado del profesor
    if (isEditOpen) {
      setSelectedProfesor({ ...selectedProfesor, [name]: parsedValue });
    } else {
      setNewProfesor({ ...newProfesor, [name]: parsedValue });
    }
  };


  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => {
    setIsOpen(false);
    setNewProfesor({
      Usuario: '',
      Contraseña: '',
      Nombres: '',
      Apellidos: '',
      Centro_ID: '',
      Año: '',
      Rol: ''
    });
  };

  const handleCreateProfesor = async () => {
    try {
      const response = await axios.post('http://localhost:4023/profesor', newProfesor);
      setProfesores([...profesores, response.data]);
      handleModalClose();
    } catch (error) {
      console.error('Error al crear el profesor:', error);
    }
  };

  const handleDeleteProfesor = async (profesorId) => {
    try {
      await axios.delete(`http://localhost:4023/profesor/${profesorId}`);
      setProfesores(profesores.filter(profesor => profesor.Profesor_ID !== profesorId));
      setFilteredProfesores(filteredProfesores.filter(profesor => profesor.Profesor_ID !== profesorId));
    } catch (error) {
      console.error('Error al eliminar el profesor:', error);
    }
  };

  const handleEditModalOpen = (profesor) => {
    setSelectedProfesor(profesor);
    setIsEditOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditOpen(false);
    setSelectedProfesor(null);
  };

  const handleEditProfesor = async () => {
    try {
      const response = await axios.put(`http://localhost:4023/profesor/${selectedProfesor.Profesor_ID}`, selectedProfesor);
      const updatedProfesores = profesores.map(profesor =>
        profesor.Profesor_ID === selectedProfesor.Profesor_ID ? response.data : profesor
      );
      setProfesores(updatedProfesores);
      setFilteredProfesores(updatedProfesores);
      handleEditModalClose();
      fetchData()
    } catch (error) {
      console.error('Error al editar el profesor:', error);
    }
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12">
      <div className="flex justify-between items-center w-full max-w-6xl m-7">
        <div className="flex items-center gap-2">
          <Input
            clearable
            placeholder="Buscar..."
            className="w-60"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onPress={handleModalOpen} color="primary" variant="solid"><FontAwesomeIcon icon={faAdd} /></Button>
      </div>

      <Divider className="my-1" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredProfesores.length > 0 ? (
          <table className="w-full border overflow-x-auto">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombres</th>
                <th className="border border-gray-300 p-2">Apellidos</th>
                <th className="border border-gray-300 p-2">Usuario</th>
                <th className="border border-gray-300 p-2">Contraseña</th>
                <th className="border border-gray-300 p-2">Centro ID</th>
                <th className="border border-gray-300 p-2">Año</th>
                <th className="border border-gray-300 p-2">Rol</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfesores.map((profesor) => (
                <tr key={profesor.Profesor_ID}>
                  <td className="border border-gray-300 p-2">{profesor.Profesor_ID}</td>
                  <td className="border border-gray-300 p-2">{profesor.Nombres}</td>
                  <td className="border border-gray-300 p-2">{profesor.Apellidos}</td>
                  <td className="border border-gray-300 p-2">{profesor.Usuario}</td>
                  <td className="border border-gray-300 p-2">{profesor.Contraseña}</td>
                  <td className="border border-gray-300 p-2">{profesor.Centro_ID}</td>
                  <td className="border border-gray-300 p-2">{profesor.Año}</td>
                  <td className="border border-gray-300 p-2">{profesor.Rol}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center space-x-2">
                      <Tooltip content='Los cambios son permanentes' color="danger" variant="light">

                        <Button onClick={() => handleDeleteProfesor(profesor.Profesor_ID)} color="danger" variant="light" auto flat>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Tooltip>

                      <Button onClick={() => handleEditModalOpen(profesor)} color="warning" variant="light" auto flat>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron profesores.</p>
        )}
      </div>

      {/* Modal para crear un nuevo profesor */}
      <Modal isOpen={isOpen} onOpenChange={handleModalClose} placement="top-center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Nuevo Profesor</ModalHeader>
              <ModalBody>
                <Input
                  name="Nombres"
                  label="Nombres"
                  placeholder="Ingrese los nombres"
                  value={newProfesor.Nombres}
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
                  placeholder="Ingrese los apellidos"
                  value={newProfesor.Apellidos}
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
                  placeholder="Ingrese el usuario"
                  value={newProfesor.Usuario}
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
                  placeholder="Ingrese la contraseña"
                  type="password"
                  value={newProfesor.Contraseña}
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
                  placeholder="Ingrese el ID del centro"
                  type="number"
                  value={newProfesor.Centro_ID}
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
                  placeholder="Ingrese el año"
                  type="number"
                  value={newProfesor.Año}
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

                <Input
                  name="Rol"
                  label="Rol"
                  placeholder="Ingrese el rol"
                  value={newProfesor.Rol}
                  onChange={handleInputChange}
                  variant="bordered"
                  color={
                    fieldValidity.Rol === true
                      ? "success"
                      : fieldValidity.Rol === false
                        ? "danger"
                        : "default"
                  }
                />
                <small className="text-red-500">{fieldMessages.Rol}</small>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={handleModalClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleCreateProfesor}>
                  Crear Profesor
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para editar profesor existente */}
      <Modal isOpen={isEditOpen} onOpenChange={handleEditModalClose} placement="top-center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar Profesor</ModalHeader>
              <ModalBody>
                <ModalBody>
                  <Input
                    name="Nombres"
                    label="Nombres"
                    placeholder="Ingrese los nombres"
                    value={selectedProfesor?.Nombres || newProfesor.Nombres}
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
                    placeholder="Ingrese los apellidos"
                    value={selectedProfesor?.Apellidos || newProfesor.Apellidos}
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
                    placeholder="Ingrese el usuario"
                    value={selectedProfesor?.Usuario || newProfesor.Usuario}
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
                    placeholder="Ingrese la contraseña"
                    type="password"
                    value={selectedProfesor?.Contraseña || newProfesor.Contraseña}
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
                    placeholder="Ingrese el ID del centro"
                    type="number"
                    value={selectedProfesor?.Centro_ID || newProfesor.Centro_ID}
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
                    placeholder="Ingrese el año"
                    type="number"
                    value={selectedProfesor?.Año || newProfesor.Año}
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

                  <Input
                    name="Rol"
                    label="Rol"
                    placeholder="Ingrese el rol"
                    value={selectedProfesor?.Rol || newProfesor.Rol}
                    onChange={handleInputChange}
                    variant="bordered"
                    color={
                      fieldValidity.Rol === true
                        ? "success"
                        : fieldValidity.Rol === false
                          ? "danger"
                          : "default"
                    }
                  />
                  <small className="text-red-500">{fieldMessages.Rol}</small>
                </ModalBody>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={handleEditModalClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleEditProfesor}>
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
