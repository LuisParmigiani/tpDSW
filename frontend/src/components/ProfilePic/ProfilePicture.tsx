import { useState } from 'react';

// Definición de tipos
export type ProfilePictureProps = {
  src: string;
  onImageChange?: (imageUrl: string) => void;
};

function ProfilePicture({ 
  src, 
  onImageChange
}: ProfilePictureProps) {
  const [uniqueId] = useState(() => `profile-image-${Math.random().toString(36).substr(2, 9)}`);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <img 
          src={src} 
          alt="Foto de perfil" 
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
        />
        
        <label 
          htmlFor={uniqueId} 
          className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </label>
        <input 
          type="file" 
          id={uniqueId} 
          accept="image/*" 
          onChange={handleImageChange}
          className="hidden" 
        />
      </div>
    </div>
  );
}

export default ProfilePicture;
