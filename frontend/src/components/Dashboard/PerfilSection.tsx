import DashboardSection from '../DashboardSection/DashboardSection';
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardSection title="Configuración de cuenta">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src={profileData.profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <label 
              htmlFor="profileImage" 
              className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </label>
            <input 
              type="file" 
              id="profileImage" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>
        </div>

        
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
