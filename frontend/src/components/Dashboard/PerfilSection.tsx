import DashboardSection from '../DashboardSection/DashboardSection';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { useState } from 'react';

function PerfilSection() {
  const [profileData, setProfileData] = useState({
    email: 'luis.parmigiani@example.com',
    firstName: 'Luis',
    lastName: 'Parmigiani',
    address: 'Av. Rivadavia 1234, Buenos Aires',
    phone: '+54 11 1234-5678',
    profileImage: '/images/fotoUserId.png'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (imageUrl: string) => {
    setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
  };

  return (
    <DashboardSection>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <ProfilePicture 
            src={profileData.profileImage}
            onImageChange={handleImageChange}
          />

        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de email
            </label>
            <input
              type="email"
              value={profileData.email}
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
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
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
              value={profileData.address}
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
              value={profileData.phone}
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
            }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </DashboardSection>
  );
}

export default PerfilSection;
