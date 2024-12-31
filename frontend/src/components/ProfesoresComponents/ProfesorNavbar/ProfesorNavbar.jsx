import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, User, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext"; // Asegúrate de importar el contexto

export const ProfesorNavbar = () => {
  const { user, logout } = useContext(AuthContext); // Obtener el usuario y la función de logout
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    navigate('/login'); // Redirige al login
  };

  const menuItems = [
    { to: "/Profesor/Estudiantes", label: "Estudiantes" },
    { to: "/Profesor/Notas", label: "Notas" },
    { to: "/Profesor/Evaluaciones", label: "Evaluaciones" },
    { to: "/Profesor/Asistencias", label: "Asistencias" },
    { to: "/Profesor/Eventos", label: "Eventos" },
    
    { to: "/Profesor/PlanDeClase", label: "Plan de Formación" }
    
  ];

  return (
    <Navbar isBordered>
      {/* Barra de marca con información del usuario */}
      <NavbarContent>
        <NavbarBrand className="flex items-center">
          <User
            name={user ? user.usuario : "Invitado"} // Nombre de usuario o "Invitado" si no está autenticado
            description="Profesor"
            avatarProps={{
              src: "", // Aquí puedes añadir la URL de la imagen del usuario si está disponible
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Menú de navegación para pantallas grandes */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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

      {/* Menú de navegación con opción de Logout para pantallas grandes */}
      <NavbarContent justify="end">
        {user ? ( // Si el usuario está autenticado
          <NavbarItem className="hidden lg:flex">
            <Button onClick={handleLogout} color="primary" variant="flat">
              Salir
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden lg:flex">
            <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              Entrar
            </NavLink>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Menú desplegable para móviles */}
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMenuOpen((prev) => !prev)} // Alternar estado del menú
        className="sm:hidden"
      />
      <NavbarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="flex flex-col items-center">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.to}>
            <NavLink to={item.to} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </NavLink>
          </NavbarMenuItem>
        ))}
        {user ? ( // Si el usuario está autenticado
          <NavbarMenuItem>
            <Button onClick={handleLogout} color="primary" variant="flat">
              Salir
            </Button>
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              Entrar
            </NavLink>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
};
