import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';

type Usuario = {
  nombre: string;
  mail: string;
  contrasena: string;
  tipoDoc: string;
  numeroDoc: string;
  telefono: string;
  apellido: string;
  direccion: string;
  nombreFantasia: string;
  descripcion: string;
};

function RegisCard() {
  // ojo para ocultar password
  /*
  const [imag, setimag] = useState(
    'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
  );
  const [type_text, settypetext] = useState('password');
*/
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Estado iniciar para los campos del formulario
  const [form, setForm] = useState<Usuario>({
    nombre: '',
    mail: '',
    contrasena: '',
    tipoDoc: '',
    numeroDoc: '',
    telefono: '',
    apellido: '',
    direccion: '',
    nombreFantasia: '',
    descripcion: '',
  });

  const [tipoUsuario, setearTipoUsuario] = useState('usuario');

  const camposComunes = (
    <>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        placeholder="Nombre"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <input
        type="text"
        name="apellido"
        value={form.apellido}
        placeholder="Apellido"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
      />
      <input
        type="email"
        name="mail"
        value={form.mail}
        placeholder="Email"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, mail: e.target.value })}
      />
      <select
        name="tipoDoc"
        value={form.tipoDoc}
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, tipoDoc: e.target.value })}
      >
        <option value="">Seleccione tipo de documento</option>
        <option value="DNI">DNI</option>
        <option value="Cuit">CUIT</option>
      </select>
      <input
        type="number"
        name="numeroDoc"
        value={form.numeroDoc}
        placeholder="Número de documento"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) =>
          setForm({ ...form, numeroDoc: e.target.value.toString() })
        }
      />
      <input
        type="text"
        name="contrasena"
        value={form.contrasena}
        placeholder="Contraseña"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter"
        onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
      />
      <input
        type="number"
        name="telefono"
        value={form.telefono}
        placeholder="Teléfono"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) =>
          setForm({ ...form, telefono: e.target.value.toString() })
        }
      />
      <input
        type="text"
        name="direccion"
        value={form.direccion}
        placeholder="Dirección"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
      />
    </>
  );

  const camposPrestatario = (
    <>
      <input
        type="text"
        name="nombreFantasia"
        value={form.nombreFantasia}
        placeholder="Nombre de fantasía"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, nombreFantasia: e.target.value })}
      />
      <input
        type="text"
        name="descripcion"
        value={form.descripcion}
        placeholder="Descripción"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
    </>
  );

  const envioFormulario = async () => {
    setOpen(true);
    if (!/^[0-9]+$/.test(form.numeroDoc)) {
      setMessage('El número de documento debe contener solo números.');
      return;
    }
    if (!/^[0-9]+$/.test(form.telefono)) {
      setMessage('El teléfono debe contener solo números.');
      return;
    }

    try {
      const res = await usuariosApi.create(form);
      if (res.data) {
        if (
          res.data.message.toLowerCase().includes('usuario.usuario_mail_unique')
        ) {
          setMessage('Ya existe un usuario con ese mail.');
        } else if (
          res.data.message
            .toLowerCase()
            .includes('usuario.usuario_numero_doc_unique')
        ) {
          setMessage('Ya existe un usuario con ese número de documento.');
        } else {
          setMessage(
            'Ya existe un usuario con ese mail, número de documento o telefono.'
          );
        }
      }
    } catch (error) {
      console.error('Error al crear usuario', error);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-5 backdrop-blur-md bg-opacity-40">
          <div className="text-black bg-white p-4 rounded shadow-md">
            <div className="flex justify-end z-30 bg-transparent w-auto">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p>{message}</p>
            <button onClick={() => setOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8 ">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-[#fff5f2] rounded-[30px] shadow-lg mt-8 overflow-hidden h-[1050px] ">
          <div className="w-full md:w-1/2 flex flex-col justify-start items-center p-6 md:p-10 ">
            <p className="text-black font-inter text-3xl md:text-5xl mb-6 font-bold text-center ">
              Crear cuenta
            </p>
            <p className="text-black font-inter mb-0 text-center">
              Selecciona el tipo de usuario
            </p>
            <select
              value={tipoUsuario}
              onChange={(e) => setearTipoUsuario(e.target.value)}
              className="mb-4 p-2 rounded bg-white text-black border border-gray-400"
            >
              <option value="usuario">Cliente</option>
              <option value="prestatario">Prestatario</option>
            </select>
            <div className="w-full flex flex-col items-center">
              {camposComunes}
              {tipoUsuario === 'prestatario' && camposPrestatario}
              <button
                onClick={envioFormulario}
                type="submit"
                className={
                  form.apellido === ''
                    ? 'w-full bg-gray-300 text-white px-5 py-[10px] rounded-[15px] cursor-pointer focus:outline-none mb-5 mt-3'
                    : 'w-full bg-naranja-1 text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg'
                }
                disabled={
                  tipoUsuario === 'prestatario' &&
                  (form.apellido === '' || form.nombre === '')
                }
              >
                Crear cuenta
              </button>
            </div>

            <p className="text-black font-inter mb-0 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-bold cursor-pointer hover:shadow-sm"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-64 md:h-full object-cover rounded-b-[30px] md:rounded-tr-[30px] md:rounded-br-[30px]"
              src="/images/carousel2.jpg"
              alt="Registro"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisCard;
