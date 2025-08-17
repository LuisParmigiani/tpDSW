import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisCard() {
  // ojo para ocultar password
  /*
  const [imag, setimag] = useState(
    'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
  );
  const [type_text, settypetext] = useState('password');
*/
  // Estado para los campos del formulario
  const [form, setForm] = useState({
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

  const [tipoUsuario, setearTipoUsuario] = useState('aaa');

  // Cambiar esto despues
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const camposComunes = (
    <>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        placeholder="Apellido"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="mail"
        value={form.mail}
        onChange={handleChange}
        placeholder="Email"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="tipoDoc"
        value={form.tipoDoc}
        onChange={handleChange}
        placeholder="Tipo de documento"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="numeroDoc"
        value={form.numeroDoc}
        onChange={handleChange}
        placeholder="Número de documento"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="contrasena"
        value={form.contrasena}
        onChange={handleChange}
        placeholder="Contraseña"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter"
      />
      <input
        type="text"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="direccion"
        value={form.direccion}
        onChange={handleChange}
        placeholder="Dirección"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
    </>
  );

  const camposPrestatario = (
    <>
      <input
        type="text"
        name="nombreFantasia"
        value={form.nombreFantasia}
        onChange={handleChange}
        placeholder="Nombre de fantasía"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
      <input
        type="text"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
      />
    </>
  );

  // ojo para ocultar password
  /*
  const handleClickCrossedEye = () => {
    if (
      imag ==
      'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
    ) {
      setimag(
        'fa-solid fa-eye absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
      );
      settypetext('text');
    } else {
      setimag(
        'fa-solid fa-eye-slash absolute top-[20%] left-[300px] text-gray-500 text-[16px] cursor-pointer'
      );
      settypetext('password');
    }
  };
  */
  async function envioFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);

    if (
      !res.ok &&
      data.message &&
      data.message.toLowerCase().includes('duplicate')
    ) {
      if (data.message.toLowerCase().includes('usuario.usuario_mail_unique')) {
        alert('Ya existe un usuario con ese mail.');
      } else if (
        data.message.toLowerCase().includes('usuario.usuario_numero_doc_unique')
      ) {
        alert('Ya existe un usuario con ese número de documento.');
      } else {
        alert(
          'Ya existe un usuario con ese mail, número de documento o telefono.'
        );
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-[#fff5f2] rounded-[30px] shadow-lg mt-8 overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <p className="text-black font-inter text-3xl md:text-[42px] mb-6 font-bold text-center">
            Crear cuenta
          </p>
          <select
            value={tipoUsuario}
            onChange={(e) => setearTipoUsuario(e.target.value)}
            className="mb-4 p-2 rounded bg-white text-black border border-gray-400"
          >
            <option value="">Selecciona tipo de usuario</option>
            <option value="usuario">Usuario</option>
            <option value="prestatario">Prestatario</option>
          </select>
          {tipoUsuario === 'usuario' && (
            <form
              onSubmit={envioFormulario}
              className="w-full flex flex-col items-center"
            >
              {camposComunes}
              <button
                type="submit"
                className="w-full bg-[#f66731] text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg"
              >
                Crear cuenta
              </button>
            </form>
          )}
          {tipoUsuario === 'prestatario' && (
            <form
              onSubmit={envioFormulario}
              className="w-full flex flex-col items-center"
            >
              {camposComunes}
              {camposPrestatario}
              <button
                type="submit"
                className="w-full bg-[#f66731] text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg"
              >
                Crear cuenta
              </button>
            </form>
          )}
          {/* <form
              onSubmit={envioFormulario}
              className="w-full flex flex-col items-center"
            >
              <div className="relative inline-block w-full">
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <i className="fa-solid fa-user absolute top-[6%] left-6 text-gray-500 text-[16px] pointer-events-none"></i>
                <input
                  type="text"
                  name="mail"
                  value={form.mail}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <i className="fa-solid fa-envelope absolute top-[31%] left-6 text-gray-500 text-[16px] pointer-events-none"></i>
                <input
                  type="text"
                  name="tipoDoc"
                  value={form.tipoDoc}
                  onChange={handleChange}
                  placeholder="Tipo de documento"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <input
                  type="text"
                  name="numeroDoc"
                  value={form.numeroDoc}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
              </div>
              <div className="relative inline-block w-full">
                <input
                  type={type_text}
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter"
                />
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
                  className="w-full pt-[12px] pb-[12px] pr-[20px] pl-[50px] text-base border-none rounded-[30px] bg-[#f5f5f5] shadow-[inset_0_0_3px_rgba(0,0,0,0.1)] outline-none mb-4 text-black font-inter "
                />
                <i
                  className={imag + ' right-6'}
                  onClick={handleClickCrossedEye}
                ></i>
                <i className="fa-solid fa-lock absolute top-[20%] left-6 text-gray-500 text-[16px] pointer-events-none"></i>
              </div>
              <button
                type="submit"
                className="w-full bg-[#f66731] text-white px-5 py-[10px] rounded-[15px] cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg"
              >
                Crear cuenta
              </button>
            </form>  */}
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
  );
}
export default RegisCard;
