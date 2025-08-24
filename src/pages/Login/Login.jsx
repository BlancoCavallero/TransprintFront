import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import logoTransprint from "../../assets/images/logoTransprint.png"
import "./Login.css";

export const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();

//   useEffect(() => {
//     const rememberedUser = localStorage.getItem("rememberedUser");
//     if (rememberedUser) {
//       setFormData(prev => ({
//         ...prev,
//         username: rememberedUser,
//         rememberMe: true,
//       }));
//     }
//   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
  
    // Validar campos vacíos
    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos Vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }
  
    try {
      // Llamada al backend para iniciar sesión
      const response = await loginApp(username, password);
  
      if (response && response.token) {
        // Pasamos el token al contexto de autenticación
        login(response.token);
  
        // Redirigir directamente al dashboard
        navigate("/dashboard");
      } else {
        throw new Error("No se recibió un token válido.");
      }
    } catch (error) {
      // Manejar errores específicos del backend
      const errorMessage = error.response?.data?.message || "Usuario o contraseña incorrectos.";
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: errorMessage,
      });
  
      // Limpiar el formulario en caso de error
      setFormData({
        username: "",
        password: "",
        rememberMe: formData.rememberMe, // Mantener el estado de "Recuérdame"
      });
    }
  };
  
  
  
  
  
  

  
  
  

  const handleRememberMe = (username, checked) => {
    if (checked) {
      localStorage.setItem("rememberedUser", username);
    } else {
      localStorage.removeItem("rememberedUser");
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => {
      const newState = {
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      };

      if (id === "rememberMe") {
        handleRememberMe(prev.username, checked);
      }
      return newState;
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    let usernameToSend = formData.username;
    if (!usernameToSend) {
      const { value: usernameInput } = await Swal.fire({
        title: "¿Olvidaste tu contraseña?",
        text: "Ingresa tu nombre de usuario para continuar",
        input: 'text',
        icon: "warning",
        inputPlaceholder: 'Tu nombre de usuario',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        footer: '<p style="margin-top: 1rem; ">Si no recordás tu usuario, comunicate con tu supervisor.</p>',
        inputValidator: (value) => {
          if (!value) {
            return '¡Debes ingresar un nombre de usuario!';
          }
        }
      });

      if (!usernameInput) return;

      // Se guarda el nombre ingresado en el modal
      setModalUsername(usernameInput);
      usernameToSend = usernameInput;
    }

    // Pregunta al usuario si está seguro de proceder
    const confirmationResult = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a intentar cambiar tu contraseña",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Si, no la recuerdo",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (confirmationResult.isConfirmed) {
      if (!usernameToSend) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se ingresó un nombre de usuario.",
        });
        return;
      }

      try {
        const response = await axios.post(
          `${backend_url}/api/mail/forgot-password`,
          { some: usernameToSend },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Cambio de contraseña",
            text: `Te enviamos un email a tu casilla de correo institucional, revisalo!`,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al intentar recuperar tu contraseña",
          text: error.response?.data.error,
        });
      }
    }
  };

  return (
    <div className="login__container">
      <div className="login__content">
        <form onSubmit={handleSubmit} className="login__form">
          <div>
            <img src={logoTransprint}
            alt="Logo de Transprint" className="login__icon"/>
          </div>
          <section className="login__form_section">
            <div className="login__form_group">
              <div className="login__input_container">
                <FaUser className="login__input_icon" size={20} />
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  className="login__input"
                />
                <label className={formData.username ? 'active' : ''}>Ingresar usuario </label>
              </div>
            </div>
            <div className="login__form_group">
              <div className="login__input_container">
                <FaLock className="login__input_icon" size={20} />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="login__input"
                />
                <label className={formData.password ? 'active' : ''}>Ingresar contraseña</label>
              </div>
            </div>
            <div className="login__remember">
              <label className="login__remember_label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="login__remember_input"
                />
                <span>Recuerdame</span>
              </label>
              {/* <span onClick={handleForgotPassword} className="login__forgot_password">
                ¿Olvidaste tu contraseña?
              </span> */}
            </div>
            <button type="submit" className="login__button ">Ingresar</button>
          </section>
        </form>
      </div>
    </div>
  );
};

