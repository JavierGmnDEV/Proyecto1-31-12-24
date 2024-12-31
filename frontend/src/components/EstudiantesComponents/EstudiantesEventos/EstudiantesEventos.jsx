import { useContext, useEffect, useState } from "react";
import {  Input, Card, CardHeader, Divider, CardBody, CardFooter } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";

export const EstudiantesEventos = () => {
  const { user,  } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]); // Lista de eventos obtenida del backend
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filteredEventos, setFilteredEventos] = useState([]); // Eventos filtrados por búsqueda

  // Llamada al backend para obtener los eventos al cargar el componente
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`http://localhost:4023/evento?anio=${user.anio}`);
        const result = await response.json();
        setEventos(result);
        setFilteredEventos(result); // Inicialmente, mostrar todos los eventos
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  // Maneja el filtro de eventos por el término de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = eventos.filter((evento) =>
      evento.Nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEventos(filtered);
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-8 p-9">
      
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
      <Divider className="my-2" />

      <div className="w-full max-w-7xl text-center my-5">
          <h2 className="text-xl font-bold">Eventos</h2>
          
        </div>
        <Divider className="my-2" />

      {/* Grid de eventos */}
      <div className="w-full max-w-7xl p-2 overflow-y-auto max-h-[80vh]">
      <div className="w-full max-w-7xl p-2 grid grid-cols-1 sm:grid-cols-3 gap-6 ">
        {filteredEventos.length > 0 ? (
          filteredEventos.map((evento) => (
            <Card key={evento.Evento_ID} className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md font-bold">{evento.Nombre}</p>
                  <p className="text-sm text-default-500">
                    Año Dirigido: {evento.Año_Dirigido}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{evento.Descripcion}</p>
                <p className="text-sm text-default-500">
                  Fecha: {new Date(evento.Fecha).toLocaleDateString()}
                </p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-end gap-2">
                {/* No incluye opciones de editar o eliminar */}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-3 text-center">No hay eventos disponibles.</p>
        )}
      </div>
      </div>
     
    </div>
  );
};
