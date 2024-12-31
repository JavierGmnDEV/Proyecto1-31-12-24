import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export const TablaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]); // Lista completa de administradores
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filteredAdministradores, setFilteredAdministradores] = useState([]); // Administradores filtrados
  const [isOpen, setIsOpen] = useState(false); // Modal de creación
  const [isEditOpen, setIsEditOpen] = useState(false); // Modal de edición
  const [newAdministrador, setNewAdministrador] = useState({
    Usuario: '',
    Contraseña: ''
  }); // Datos para crear un administrador
  const [selectedAdministrador, setSelectedAdministrador] = useState(null); // Administrador seleccionado para editar

  useEffect(() => {
    fetchAdministradores();
  }, []);

  // Función para obtener todos los administradores
  const fetchAdministradores = async () => {
    try {
      const response = await axios.get('http://localhost:4023/administracion', {
        headers: { "Content-Type": "application/json" },
        data: {
          Profesor_ID: 1,
          Tipo_Evaluacion: "Entrega",
          Tema_A_Evaluar: "Matemáticas",
          Fecha_Evaluacion: "2024-05-01"
        }
      });
      setAdministradores(response.data);
      setFilteredAdministradores(response.data); // Inicialmente, los administradores filtrados son todos
    } catch (error) {
      console.error('Error al obtener los administradores:', error);
    }
  };

  // Función de búsqueda por nombre de usuario
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = administradores.filter(admin =>
      admin.Usuario.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAdministradores(filtered);
  };

  // Función para manejar el cambio en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

      // Utiliza este fragmento para cada campo que quieras validar:
  const { message, isValid } = validateField(name, value);
  
  setFieldMessages((prev) => ({ ...prev, [name]: message }));
  setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
  
    if (isEditOpen) {
      setSelectedAdministrador({ ...selectedAdministrador, [name]: value });
    } else {
      setNewAdministrador({ ...newAdministrador, [name]: value });
    }
  };

  // Abrir/cerrar modal de creación
  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => {
    setIsOpen(false);
    setNewAdministrador({
      Usuario: '',
      Contraseña: ''
    });
  };

  // Crear nuevo administrador
  const handleCreateAdministrador = async () => {
    try {
      const response = await axios.post('http://localhost:4023/administracion', newAdministrador);
      setAdministradores([...administradores, response.data]);
      handleModalClose();
      fetchAdministradores();
    } catch (error) {
      console.error('Error al crear el administrador:', error);
    }
  };

  // Abrir/cerrar modal de edición
  const handleEditModalOpen = (admin) => {
    setSelectedAdministrador(admin);
    setIsEditOpen(true);
  };
  const handleEditModalClose = () => {
    setIsEditOpen(false);
    setSelectedAdministrador(null);
  };

  // Editar administrador existente
  const handleEditAdministrador = async () => {
    try {
      const response = await axios.put(`http://localhost:4023/administracion/${selectedAdministrador.Administracion_ID}`, selectedAdministrador);
      const updatedAdministradores = administradores.map(admin =>
        admin.Administracion_ID === selectedAdministrador.Administracion_ID ? response.data : admin
      );
      setAdministradores(updatedAdministradores);
      setFilteredAdministradores(updatedAdministradores);
      handleEditModalClose();
      fetchAdministradores();
    } catch (error) {
      console.error('Error al editar el administrador:', error);
    }
  };

  // Eliminar administrador
  const handleDeleteAdministrador = async (adminId) => {
    try {
      await axios.delete(`http://localhost:4023/administracion/${adminId}`);
      const updatedAdministradores = administradores.filter(admin => admin.Administracion_ID !== adminId);
      setAdministradores(updatedAdministradores);
      setFilteredAdministradores(updatedAdministradores);
      fetchAdministradores();
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
    }
  };


  const [fieldMessages, setFieldMessages] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});
  
  const validateField = (name, value) => {
    let message = "";
    let isValid = false;
  
    switch (name) {
      case "Usuario":
        if (!value) {
          message = "Este campo es obligatorio.";
        } else if (value.length < 3) {
          message = "El usuario debe tener al menos 3 caracteres.";
        } else if (value.length > 50) {
          message = "El usuario no puede exceder los 50 caracteres.";
        } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
          message = "El usuario solo puede contener letras, números y guiones bajos.";
        } else {
          isValid = true;
        }
        break;
  
      case "Contraseña":
        if (!value) {
          message = "Este campo es obligatorio.";
        } else if (value.length < 6) {
          message = "La contraseña debe tener al menos 6 caracteres.";
        } else if (value.length > 50) {
          message = "La contraseña no puede exceder los 50 caracteres.";
        } else {
          isValid = true;
        }
        break;
  
      default:
        break;
    }
  
    return { message, isValid };
  };
  


  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-12 ">
      {/* Barra de control encima de la tabla */}
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <div className="flex items-center gap-2">
          <Input
            clearable
            placeholder="Buscar por usuario..."
            className="w-60"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={handleModalOpen} color="primary"><FontAwesomeIcon icon={faAdd} /></Button>
      </div>

      <Divider className="my-1" />

      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredAdministradores.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Usuario</th>
                <th className="border p-2">Contraseña</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdministradores.map((admin) => (
                <tr key={admin.Administracion_ID}>
                  <td className="border p-2">{admin.Administracion_ID}</td>
                  <td className="border p-2">{admin.Usuario}</td>
                  <td className="border p-2">{admin.Contraseña}</td>
                  <td className="border p-2">
                    <div className="flex justify-center space-x-2">
                    <Tooltip content='Los cambios son permanentes' color="danger" variant="light">

                      <Button onClick={() => handleDeleteAdministrador(admin.Administracion_ID)} color="danger" variant="light">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Tooltip>
                      <Button onClick={() => handleEditModalOpen(admin)} color="warning" variant="light">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron administradores. <Spinner /></p>
        )}
      </div>

    {/* Modal para crear un nuevo administrador */}
<Modal isOpen={isOpen} onOpenChange={handleModalClose}>
  <ModalContent>
    <ModalHeader>Crear Nuevo Administrador</ModalHeader>
    <ModalBody>
      <Input
        name="Usuario"
        label="Usuario"
        placeholder="Ingrese usuario"
        value={newAdministrador.Usuario}
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
      
      <Input
        name="Contraseña"
        label="Contraseña"
        type="password"
        placeholder="Ingrese contraseña"
        value={newAdministrador.Contraseña}
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
    </ModalBody>
    <ModalFooter>
      <Button color="danger" variant="flat" onClick={handleModalClose}>
        Cerrar
      </Button>
      <Button color="primary" onClick={handleCreateAdministrador}>
        Crear Administrador
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

{/* Modal para editar administrador existente */}
<Modal isOpen={isEditOpen} onOpenChange={handleEditModalClose}>
  <ModalContent>
    <ModalHeader>Editar Administrador</ModalHeader>
    <ModalBody>
      <Input
        name="Usuario"
        label="Usuario"
        placeholder="Ingrese usuario"
        value={selectedAdministrador?.Usuario || ""}
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
      
      <Input
        name="Contraseña"
        label="Contraseña"
        type="password"
        placeholder="Ingrese contraseña"
        value={selectedAdministrador?.Contraseña || ""}
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
    </ModalBody>
    <ModalFooter>
      <Button color="danger" variant="flat" onClick={handleEditModalClose}>
        Cerrar
      </Button>
      <Button color="primary" onClick={handleEditAdministrador}>
        Guardar Cambios
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  );
};
