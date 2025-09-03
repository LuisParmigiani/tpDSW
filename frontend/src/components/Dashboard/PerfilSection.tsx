import DashboardSection from '../DashboardSection/DashboardSection';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { useEffect, useState } from 'react';
import { usuariosApi } from '../../services/usuariosApi.ts';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
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
  // Remove unused id parameter
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<PrestadorData | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Move useProtectRoute to top level
  const { usuario, loading: authLoading } = useProtectRoute(['prestador']);

  // Move useEffect to top level
  useEffect(() => {
    if (!authLoading && usuario) {
      fetchPrestador(usuario.id.toString());
    }
  }, [usuario, authLoading]);

  const fetchPrestador = async (id: string) => {
    try {
      setError(null);
      console.log('Fetching user with id:', id);

      const response = await usuariosApi.getByIdOnlyInfo(id);
      console.log('API Response:', response); // Debug log

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

  // Early returns after hooks
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

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);

    try {
      console.log('Uploading image:', file.name, 'for user id:', usuario.id);
      const res = await usuariosApi.uploadProfileImage(
        usuario.id.toString(),
        file
      );
      console.log('Upload response:', res);
      if (res.data && res.data.imageUrl) {
        //construyo la url correcta para que el front pueda acceder a donde esta guardada la foto
        setProfileData((prev) =>
          prev ? { ...prev, foto: res.data.imageUrl } : null
        );
        console.log(profileData?.foto);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
  };
  if (dataFetched && profileData) {
    return (
      <DashboardSection>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <ProfilePicture
            src={profileData.foto}
            onImageChange={handleImageUpload}
            uploading={uploading}
          />

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de email
              </label>
              <input
                type="email"
                value={profileData.mail}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profileData.nombre}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={profileData.apellido}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={profileData.direccion}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none"
                placeholder="Tu dirección completa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={profileData.telefono}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none"
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer"
              onClick={() => {
                console.log('Datos a guardar:', profileData);
                //Llamo a la api para guardar los cambios
                try {
                  usuariosApi.update(usuario.id.toString(), {
                    ...profileData,
                  });
                } catch (error) {
                  console.error('Error updating user:', error);
                }
              }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No se pudo cargar la información del perfil
      </div>
    );
  }
}

export default PerfilSection;
