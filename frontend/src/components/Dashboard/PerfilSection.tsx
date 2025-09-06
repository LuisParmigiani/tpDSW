import DashboardSection from '../DashboardSection/DashboardSection';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usuariosApi } from '../../services/usuariosApi.ts';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts.tsx';

// ✅ Updated Zod schema to include photo
const profileSchema = z.object({
  mail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  direccion: z
    .string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe ser más específica')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(
      /^[+]?[0-9\s\-()]{8,20}$/,
      'Formato de teléfono inválido (ej: +54 11 1234-5678)'
    ),
  // ✅ Add photo as optional field - it will be handled separately but tracked by the form
  foto: z.string().optional(),
});

// ✅ Infer type from schema
type ProfileFormData = z.infer<typeof profileSchema>;

type PrestadorData = {
  id: number;
  mail: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  foto: string;
};

function PerfilSection() {
  // State management
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<PrestadorData | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<{
    error: string;
    message: string;
  } | null>(null);
  // ✅ Track pending image for form submission
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const { usuario, loading: authLoading } = useProtectRoute(['prestador']);

  // ✅ React Hook Form setup with Zod validation
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      mail: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      foto: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = form;

  // Fetch user data
  useEffect(() => {
    if (!authLoading && usuario) {
      fetchPrestador(usuario.id.toString());
    }
  }, [usuario, authLoading]);

  // ✅ Update form when profile data is loaded
  useEffect(() => {
    if (profileData) {
      console.log('Updating form with profile data:', profileData);
      reset({
        mail: profileData.mail || '',
        nombre: profileData.nombre || '',
        apellido: profileData.apellido || '',
        direccion: profileData.direccion || '',
        telefono: profileData.telefono || '',
        foto: profileData.foto || '',
      });
    }
  }, [profileData, reset]);

  const fetchPrestador = async (id: string) => {
    try {
      setError(null);
      console.log('Fetching user with id:', id);

      const response = await usuariosApi.getByIdOnlyInfo(id);
      console.log('API Response:', response);

      if (response.data && response.data.data) {
        setProfileData(response.data.data);
        setDataFetched(true);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error: any) {
      console.error('Error fetching prestador data:', error);
      setError(error.message || 'Error loading profile data');
      setDataFetched(false);
    }
  };

  // Early returns
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">No autorizado</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // ✅ Handle image selection (not upload yet)
  const handleImageChange = async (file: File) => {
    if (!file) return;

    // Store the file for later upload
    setPendingImageFile(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);

    // ✅ Update form state to trigger isDirty
    setValue('foto', tempUrl, { shouldDirty: true });

    // Update local state for immediate UI feedback
    setProfileData((prev) => (prev ? { ...prev, foto: tempUrl } : null));

    console.log('📸 Image selected, form is now dirty');
  };

  // ✅ Form submission handler - handles both data and image
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdateError(null);
      setUploading(true);
      console.log('Form data to save:', data);

      // ✅ First upload image if there's a pending one
      let updatedImageUrl = profileData?.foto;
      if (pendingImageFile) {
        console.log('📤 Uploading new image...');
        try {
          const imageResponse = await usuariosApi.uploadProfileImage(
            usuario.id.toString(),
            pendingImageFile
          );

          if (imageResponse.data && imageResponse.data.imageUrl) {
            updatedImageUrl = `${imageResponse.data.imageUrl}?t=${Date.now()}`;
            console.log('✅ Image uploaded successfully:', updatedImageUrl);
          }
        } catch (imageError) {
          console.error('❌ Image upload failed:', imageError);
          throw new Error('Error al subir la imagen');
        }
      }

      // ✅ Then update user data
      const updateData = {
        ...profileData,
        ...data,
        foto: updatedImageUrl, // Use the uploaded image URL
      };
      console.log('Updating user data with:', updateData);
      await usuariosApi.update(usuario.id.toString(), updateData);

      // ✅ Update local state with final data
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              foto: updatedImageUrl || prev.foto,
            }
          : null
      );

      // ✅ Clear pending image and reset form
      setPendingImageFile(null);
      reset({
        ...data,
        foto: updatedImageUrl || data.foto,
      });

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

      console.log('✅ Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setUpdateError({
        error: error.response.data.error || 'Error',
        message: error.response.data.message || 'Error al actualizar el perfil',
      });
    } finally {
      setUploading(false);
    }
  };

  if (dataFetched && profileData) {
    return (
      <DashboardSection>
        {/* Success Alert */}
        {updateSuccess && (
          <Alert
            variant="success"
            className="mb-4 max-w-xl mx-auto"
            autoClose={true}
            autoCloseDelay={5000}
            onClose={() => setUpdateSuccess(false)}
          >
            <AlertTitle>¡Perfil actualizado!</AlertTitle>
            <AlertDescription>
              Los datos del perfil se han guardado correctamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {updateError && (
          <Alert
            variant="danger"
            className="mb-4 max-w-xl mx-auto"
            onClose={() => setUpdateError(null)}
          >
            <AlertTitle>{updateError.error}</AlertTitle>
            <AlertDescription>{updateError.message}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* ✅ Form now includes everything */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ✅ Profile Picture inside form */}
            <div className="flex justify-center mb-8">
              <ProfilePicture
                src={profileData.foto}
                onImageChange={handleImageChange}
                uploading={uploading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de email
              </label>
              <input
                type="email"
                {...register('mail')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none ${
                  errors.mail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mail.message}
                </p>
              )}
            </div>

            {/* Name and Last Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register('nombre')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register('apellido')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                {...register('direccion')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu dirección completa"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+54 11 1234-5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* ✅ Submit Button - now active when image changes */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && !pendingImageFile)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting || (!isDirty && !pendingImageFile)
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>

              {/* ✅ Updated helper text */}
              {!isDirty && !pendingImageFile && (
                <p className="mt-2 text-sm text-gray-500">
                  No hay cambios para guardar
                </p>
              )}

              {pendingImageFile && (
                <p className="mt-2 text-sm text-naranja-1">
                  📸 Imagen seleccionada - haz clic en "Guardar cambios" para
                  aplicar
                </p>
              )}
            </div>
          </form>
        </div>
      </DashboardSection>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">
          No se pudo cargar la información del perfil
        </div>
      </div>
    );
  }
}

export default PerfilSection;
