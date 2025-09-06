import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';
import { z } from 'zod';
import { cn } from '../../lib/utils.ts';
import ProfilePicture from '../ProfilePic/ProfilePicture.tsx';

//Algunas validaciones no son necesarias pero las dejo para poder crear el objeto

// eslint-disable-next-line react-refresh/only-export-components
export const usuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  mail: z.string().email('Email inválido'),
  contrasena: z
    .string()
    .min(
      6,
      'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número'
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
    ),
  tipoDoc: z.string().min(1, 'El tipo de documento es obligatorio'),
  numeroDoc: z.string().regex(/^[0-9]+$/, 'Solo números'),
  telefono: z.string().regex(/^[0-9]+$/, 'Solo números'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  nombreFantasia: z.string(),
  descripcion: z.string(),
  foto: z.string().optional(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

function RegisCard() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  // ✅ Add uploading state for image
  const [uploading, setUploading] = useState(false);
  // ✅ Track pending image file for form submission
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  //Clases de tailwind para sacar los spinners del input type number en formato desktop
  const sacarSpinners =
    'md:[appearance:textfield] md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[&::-webkit-outer-spin-button]:m-0 md:[&::-webkit-inner-spin-button]:m-0';

  // Estado inicial para los campos del formulario
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
    foto: '',
  });

  const [tipoUsuario, setearTipoUsuario] = useState('usuario');

  // ✅ Handle image selection (following PerfilSection pattern)
  const handleImageChange = async (file: File) => {
    if (!file) return;

    // Store the file for later upload
    setPendingImageFile(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);

    // Update form state with temp URL
    setForm((prev) => ({ ...prev, foto: tempUrl }));

    console.log('📸 Image selected for registration');
  };

  const camposComunes = (
    <>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        placeholder="Nombre"
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <input
        type="text"
        name="apellido"
        value={form.apellido}
        placeholder="Apellido"
        className={cn(
          'w-full pt-3 pb-3 pr-5 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
      />
      <input
        type="email"
        name="mail"
        value={form.mail}
        placeholder="Email"
        className={cn(
          'w-full pt-3 pb-3 pr-5 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, mail: e.target.value })}
      />
      <select
        name="tipoDoc"
        value={form.tipoDoc}
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
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
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent',
          sacarSpinners
        )}
        onChange={(e) =>
          setForm({ ...form, numeroDoc: e.target.value.toString() })
        }
      />
      <input
        type="text"
        name="contrasena"
        value={form.contrasena}
        placeholder="Contraseña"
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
      />
      <input
        type="number"
        name="telefono"
        value={form.telefono}
        placeholder="Teléfono"
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent',
          sacarSpinners
        )}
        onChange={(e) =>
          setForm({ ...form, telefono: e.target.value.toString() })
        }
      />
      <input
        type="text"
        name="direccion"
        value={form.direccion}
        placeholder="Dirección"
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
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
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, nombreFantasia: e.target.value })}
      />
      <input
        type="text"
        name="descripcion"
        value={form.descripcion}
        placeholder="Descripción"
        className={cn(
          'w-full pt-3 pb-3 pr-20 pl-12 text-base border-none',
          'rounded-4xl bg-white shadow-inner outline-none mb-4',
          'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
          'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
        )}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
    </>
  );

  // ✅ Updated form submission with image upload (following PerfilSection pattern)
  const envioFormulario = async () => {
    setOpen(true);
    setUploading(true);

    const resultado = usuarioSchema.safeParse(form);
    if (!resultado.success) {
      const errores = resultado.error.issues;
      setMessage(errores[0]?.message || 'Datos inválidos');
      setUploading(false);
      return;
    }

    try {
      // ✅ First create user
      const userResponse = await usuariosApi.create(form);
      console.log('User created:', userResponse);

      // ✅ Then upload image if there's a pending one (only for prestatarios)
      if (
        pendingImageFile &&
        tipoUsuario === 'prestatario' &&
        userResponse.data?.data?.id
      ) {
        console.log('📤 Uploading profile image for new user...');
        try {
          const imageResponse = await usuariosApi.uploadProfileImage(
            userResponse.data.data.id.toString(),
            pendingImageFile
          );
          console.log('✅ Profile image uploaded successfully:', imageResponse);
        } catch (imageError) {
          console.error(
            '❌ Image upload failed (but user was created):',
            imageError
          );
          // Don't fail the whole process if image upload fails
        }
      }

      setMessage('Usuario creado correctamente');

      // ✅ Reset form and clear pending image
      setForm({
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
        foto: '',
      });
      setPendingImageFile(null);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message?.toLowerCase() || '';
      if (msg.includes('usuario.usuario_mail_unique')) {
        setMessage('Ya existe un usuario con ese mail.');
      } else if (msg.includes('usuario.usuario_numero_doc_unique')) {
        setMessage('Ya existe un usuario con ese número de documento.');
      } else if (msg.includes('duplicate')) {
        setMessage('Ya existe un usuario con ese numero de telefono.');
      } else {
        setMessage('Error al crear usuario');
      }
      console.error('Error al crear usuario', error);
    } finally {
      setUploading(false);
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
            <button
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8 ">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto  bg-gray-100 rounded-4xl shadow-lg mt-8 overflow-hidden min-h-[700px] ">
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
              <form
                className="w-full flex flex-col items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  envioFormulario();
                }}
              >
                {tipoUsuario === 'prestatario' && (
                  <>
                    <div className="flex justify-center mb-4">
                      <ProfilePicture
                        src={form.foto || '/images/fotoUserId.png'}
                        onImageChange={handleImageChange}
                        uploading={uploading}
                      />
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-2 mb-4 font-inter">
                      Elija una foto para su cuenta, podrá cambiarla luego desde
                      su perfil.
                    </p>
                    {pendingImageFile && (
                      <p className="text-center text-naranja-1 text-sm mb-4 font-inter">
                        📸 Imagen seleccionada - se subirá al crear la cuenta
                      </p>
                    )}
                  </>
                )}
                {camposComunes}
                {tipoUsuario === 'prestatario' && camposPrestatario}
                <button
                  type="submit"
                  disabled={
                    uploading || // ✅ Disable while uploading
                    (tipoUsuario === 'prestatario' &&
                      (form.apellido === '' ||
                        form.nombre === '' ||
                        form.mail === '' ||
                        form.descripcion === '' ||
                        form.nombreFantasia === '' ||
                        form.contrasena === '' ||
                        form.tipoDoc === '' ||
                        form.numeroDoc === '' ||
                        form.telefono === '' ||
                        form.direccion === '')) ||
                    (tipoUsuario === 'usuario' &&
                      (form.apellido === '' ||
                        form.nombre === '' ||
                        form.mail === '' ||
                        form.contrasena === '' ||
                        form.tipoDoc === '' ||
                        form.numeroDoc === '' ||
                        form.telefono === '' ||
                        form.direccion === ''))
                  }
                  className={
                    uploading || // ✅ Show loading state
                    (tipoUsuario === 'prestatario' &&
                      ((form.nombreFantasia === '' && form.apellido === '') ||
                        form.nombre === '' ||
                        form.mail === '' ||
                        form.descripcion === '' ||
                        form.contrasena === '' ||
                        form.tipoDoc === '' ||
                        form.numeroDoc === '' ||
                        form.telefono === '' ||
                        form.direccion === '')) ||
                    (tipoUsuario === 'usuario' &&
                      (form.nombre === '' ||
                        form.apellido === '' ||
                        form.mail === '' ||
                        form.contrasena === '' ||
                        form.tipoDoc === '' ||
                        form.numeroDoc === '' ||
                        form.telefono === '' ||
                        form.direccion === ''))
                      ? 'w-full bg-gray-300 text-white px-5 py-2.5 rounded-b-2xl cursor-not-allowed focus:outline-none mb-5 mt-3'
                      : cn(
                          'w-full border-2 border-naranja-1 bg-naranja-1 text-white px-5 py-2.5 rounded-b-2xl cursor-pointer mb-5 mt-3 hover:shadow-lg',
                          'hover:bg-white hover:text-naranja-1 hover:border-naranja-1 transition-all ease-in-out duration-300 focus:outline-none'
                        )
                  }
                >
                  {/* ✅ Show loading state */}
                  {uploading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            </div>

            <p className="text-black font-inter mb-0 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-bold cursor-pointer hover:border-b-2 border-naranja-1 shadow-2xs "
              >
                Inicia sesión
              </Link>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-64 md:h-full object-cover rounded-b-4xl md:rounded-tr-4xl md:rounded-br-4xl"
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
