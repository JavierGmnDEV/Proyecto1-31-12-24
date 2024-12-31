import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Divider, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



export const TablaCentros = () => {
  const [centros, setCentros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCentros, setFilteredCentros] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [newCentro, setNewCentro] = useState({
    Lugar: '',
    Nombre: '',
    Descripcion: ''
  });

  const [selectedCentro, setSelectedCentro] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4023/centro');
      const centros = response.data;
      setCentros(centros);
      setFilteredCentros(centros);
    } catch (error) {
      console.error('Error al obtener los centros:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = centros.filter(centro =>
      centro.Nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCentros(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const { message, isValid } = validateField(name, value);

    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
  
    if (isEditOpen) {
      setSelectedCentro({ ...selectedCentro, [name]: value });
    } else {
      setNewCentro({ ...newCentro, [name]: value });
    }
  };

  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => {
    setIsOpen(false);
    setNewCentro({
      Lugar: '',
      Nombre: '',
      Descripcion: ''
    });
  };

  const handleCreateCentro = async () => {
    try {
      const response = await axios.post('http://localhost:4023/centro', newCentro);
      setCentros([...centros, response.data]);
      handleModalClose();
      fetchData()
    } catch (error) {
      console.error('Error al crear el centro:', error);
    }
  };

  const handleDeleteCentro = async (centroId) => {
    try {
      await axios.delete(`http://localhost:4023/centro/${centroId}`);
      setCentros(centros.filter(centro => centro.Centro_ID !== centroId));
      setFilteredCentros(filteredCentros.filter(centro => centro.Centro_ID !== centroId));
      fetchData()
    } catch (error) {
      console.error('Error al eliminar el centro:', error);
    }
  };

  const handleEditModalOpen = (centro) => {
    setSelectedCentro(centro);
    setIsEditOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditOpen(false);
    setSelectedCentro(null);
  };

  const handleEditCentro = async () => {
    try {
      const response = await axios.put(`http://localhost:4023/centro/${selectedCentro.Centro_ID}`, selectedCentro);
      const updatedCentros = centros.map(centro =>
        centro.Centro_ID === selectedCentro.Centro_ID ? response.data : centro
      );
      setCentros(updatedCentros);
      setFilteredCentros(updatedCentros);
      handleEditModalClose();
      fetchData();
    } catch (error) {
      console.error('Error al editar el centro:', error);
    }
  };

  const [fieldMessages, setFieldMessages] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});
  
  const validateField = (name, value) => {
    let message = "";
    let isValid = false;
  
    switch (name) {
      case "Lugar":
        if (!value) {
          message = "Este campo es obligatorio.";
        } else {
          isValid = true;
        }
        break;
  
      case "Nombre":
        if (!value) {
          message = "Este campo es obligatorio.";
        } else if (value.length < 3) {
          message = "El nombre debe tener al menos 3 caracteres.";
        } else if (value.length > 100) {
          message = "El nombre no puede exceder los 100 caracteres.";
        } else {
          isValid = true;
        }
        break;
  
      case "Descripcion":
        if (!value) {
          message = "Este campo es obligatorio.";
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
      <div className="flex justify-between items-center w-full max-w-6xl m-7">
        <div className="flex items-center gap-2">
          <Input
            clearable
            placeholder="Buscar por nombre..."
            className="w-60"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onPress={handleModalOpen} color="primary"><FontAwesomeIcon icon={faAdd} /></Button>
      </div>

      <Divider className="my-1" />
      
      <div className="w-full max-w-7xl bg-white p-2 rounded-lg shadow-md overflow-x-auto" style={{ marginTop: "20px" }}>
        {filteredCentros.length > 0 ? (
          <table className="w-full border overflow-x-auto ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Lugar</th>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Descripción</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCentros.map((centro) => (
                <tr key={centro.Centro_ID}>
                  <td className="border border-gray-300 p-2">{centro.Centro_ID}</td>
                  <td className="border border-gray-300 p-2">{centro.Lugar}</td>
                  <td className="border border-gray-300 p-2">{centro.Nombre}</td>
                  <td className="border border-gray-300 p-2">{centro.Descripcion}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center space-x-2">
                    <Tooltip content='Los cambios son permanentes' color="danger" variant="light">

                      <Button onClick={() => handleDeleteCentro(centro.Centro_ID)} color="danger" variant="light" auto flat>
                      <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Tooltip>
                      <Button onClick={() => handleEditModalOpen(centro)} color="warning" variant="light" auto flat>
                      <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center">
            <p>No se encontraron centros. <Spinner /></p> 
          </div>
        )}
      </div>

     {/* Modal para crear un nuevo centro */}
<Modal isOpen={isOpen} onOpenChange={handleModalClose} placement="top-center">
  <ModalContent>
    {() => (
      <>
        <ModalHeader className="flex flex-col gap-1">Crear Nuevo Centro</ModalHeader>
        <ModalBody>
          <Input
            name="Lugar"
            label="Lugar"
            placeholder="Ingrese el lugar"
            value={newCentro.Lugar}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Lugar ? "default" : "danger"}
          />
          {fieldMessages.Lugar && <span className="text-red-600">{fieldMessages.Lugar}</span>}

          <Input
            name="Nombre"
            label="Nombre"
            placeholder="Ingrese el nombre"
            value={newCentro.Nombre}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Nombre ? "default" : "danger"}
          />
          {fieldMessages.Nombre && <span className="text-red-600">{fieldMessages.Nombre}</span>}

          <Input
            name="Descripcion"
            label="Descripción"
            placeholder="Ingrese la descripción"
            value={newCentro.Descripcion}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Descripcion ? "default" : "danger"}
          />
          {fieldMessages.Descripcion && <span className="text-red-600">{fieldMessages.Descripcion}</span>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={handleModalClose}>
            Cerrar
          </Button>
          <Button
            color="primary"
            onPress={handleCreateCentro}
            disabled={!fieldValidity.Lugar || !fieldValidity.Nombre || !fieldValidity.Descripcion}
          >
            Crear Centro
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

{/* Modal para editar centro existente */}
<Modal isOpen={isEditOpen} onOpenChange={handleEditModalClose} placement="top-center">
  <ModalContent>
    {() => (
      <>
        <ModalHeader className="flex flex-col gap-1">Editar Centro</ModalHeader>
        <ModalBody>
          <Input
            name="Lugar"
            label="Lugar"
            placeholder="Ingrese el lugar"
            value={selectedCentro?.Lugar || ""}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Lugar ? "default" : "danger"}
          />
          {fieldMessages.Lugar && <span className="text-red-600">{fieldMessages.Lugar}</span>}

          <Input
            name="Nombre"
            label="Nombre"
            placeholder="Ingrese el nombre"
            value={selectedCentro?.Nombre || ""}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Nombre ? "default" : "danger"}
          />
          {fieldMessages.Nombre && <span className="text-red-600">{fieldMessages.Nombre}</span>}

          <Input
            name="Descripcion"
            label="Descripción"
            placeholder="Ingrese la descripción"
            value={selectedCentro?.Descripcion || ""}
            onChange={handleInputChange}
            variant="bordered"
            status={fieldValidity.Descripcion ? "default" : "danger"}
          />
          {fieldMessages.Descripcion && <span className="text-red-600">{fieldMessages.Descripcion}</span>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={handleEditModalClose}>
            Cerrar
          </Button>
          <Button
            color="primary"
            onPress={handleEditCentro}
            disabled={!fieldValidity.Lugar || !fieldValidity.Nombre || !fieldValidity.Descripcion}
          >
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
