import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, User, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, } from "@nextui-org/react";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export const MenuAdmin = () => {
  const { user, logout } = useContext(AuthContext); // Obtener el usuario y la función de logout
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    navigate('/login'); // Redirige al login
  };

  const menuItems = [
    { to: "/Admin/Administracion", label: "Administradores" },
    { to: "/Admin/Estudiantes", label: "Estudiantes" },
    { to: "/Admin/Evaluaciones", label: "Evaluaciones" },
    { to: "/Admin/Asistencias", label: "Asistencias" },
    { to: "/Admin/Profesores", label: "Profesores" },
    { to: "/Admin/Centros", label: "Centros" },
  ];

  return (
    <Navbar isBordered>
      <NavbarContent>
        <NavbarBrand className="flex items-center">
          <User
            name={user ? user.Usuario : "Invitado"}
            description="ADMINISTRADOR"
            avatarProps={{
              src: "", // Aquí puedes añadir la URL de la imagen del usuario si está disponible
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-primary border-b-2 border-blue-500" : "text-foreground"
              }
            >
              {item.label}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? ( // Condicional para verificar si hay un usuario autenticado
          <>
            <NavbarItem className=" hidden  md:flex">
              <Button onClick={handleLogout} color="primary" variant="flat">
               Salir
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "")}>
                Entrar
              </NavLink>
            </NavbarItem>
            
          </>
        )}
      </NavbarContent>

      {/* Menú desplegable para móviles */}
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMenuOpen((prev) => !prev)} // Alternar estado del menú
        className="sm:hidden"
      />
      <NavbarMenu  isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="flex flex-col items-center">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.to}>
            <NavLink to={item.to} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </NavLink>
           
          </NavbarMenuItem>
          
        ))}
         {user ? ( // Condicional para verificar si hay un usuario autenticado
          <>
            <NavbarItem className="md:flex ">
              <Button onClick={handleLogout} color="primary" variant="flat">
                Salir
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className=" lg:flex">
              <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "")}>
                Entrar
              </NavLink>
            </NavbarItem>
            
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};
