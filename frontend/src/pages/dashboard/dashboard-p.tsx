import { useState } from 'react';
import DashNav from '../../components/DashNav/DashNavNew';
import type { MenuItem } from '../../components/DashNav/DashNavNew';
import PerfilSection from '../../components/Dashboard/PerfilSection';
import ClientesSection from '../../components/Dashboard/ClientesSection';
import ServiciosSection from '../../components/Dashboard/ServiciosSection';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('perfil');

  
  const customMenuItems: MenuItem[] = [
    {
      id: 'perfil',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.75 28.4375H11.25C4.4625 28.4375 1.5625 25.5375 1.5625 18.75V11.25C1.5625 4.4625 4.4625 1.5625 11.25 1.5625H18.75C25.5375 1.5625 28.4375 4.4625 28.4375 11.25V18.75C28.4375 25.5375 25.5375 28.4375 18.75 28.4375ZM11.25 3.4375C5.4875 3.4375 3.4375 5.4875 3.4375 11.25V18.75C3.4375 24.5125 5.4875 26.5625 11.25 26.5625H18.75C24.5125 26.5625 26.5625 24.5125 26.5625 18.75V11.25C26.5625 5.4875 24.5125 3.4375 18.75 3.4375H11.25Z" fill="currentColor"/>
          <path d="M15.0003 16.3496C14.8378 16.3496 14.6753 16.3121 14.5253 16.2246L7.90028 12.3996C7.45028 12.1371 7.30025 11.5621 7.56275 11.1246C7.82525 10.6746 8.40028 10.5246 8.83778 10.7871L14.9878 14.3496L21.1003 10.8121C21.5503 10.5496 22.1253 10.7121 22.3753 11.1496C22.6253 11.5871 22.4753 12.1746 22.0378 12.4246L15.4628 16.2246C15.3253 16.2996 15.1628 16.3496 15.0003 16.3496Z" fill="currentColor"/>
          <path d="M15 23.1501C14.4875 23.1501 14.0625 22.7251 14.0625 22.2126V15.4126C14.0625 14.9001 14.4875 14.4751 15 14.4751C15.5125 14.4751 15.9375 14.9001 15.9375 15.4126V22.2126C15.9375 22.7251 15.5125 23.1501 15 23.1501Z" fill="currentColor"/>
          <path d="M14.9998 23.4373C14.2748 23.4373 13.5624 23.2748 12.9874 22.9623L8.98733 20.7373C7.78733 20.0748 6.8623 18.4873 6.8623 17.1123V12.8748C6.8623 11.5123 7.79983 9.92476 8.98733 9.24976L12.9874 7.02476C14.1374 6.38726 15.8623 6.38726 17.0123 7.02476L21.0123 9.24976C22.2123 9.91226 23.1374 11.4998 23.1374 12.8748V17.1123C23.1374 18.4748 22.1998 20.0623 21.0123 20.7373L17.0123 22.9623C16.4373 23.2873 15.7248 23.4373 14.9998 23.4373ZM14.9998 8.43726C14.5873 8.43726 14.1873 8.51226 13.8998 8.67476L9.89984 10.8998C9.28734 11.2373 8.7373 12.1873 8.7373 12.8748V17.1123C8.7373 17.8123 9.28734 18.7498 9.89984 19.0873L13.8998 21.3123C14.4748 21.6373 15.5248 21.6373 16.0998 21.3123L20.0998 19.0873C20.7123 18.7498 21.2624 17.7998 21.2624 17.1123V12.8748C21.2624 12.1748 20.7123 11.2373 20.0998 10.8998L16.0998 8.67476C15.8123 8.51226 15.4123 8.43726 14.9998 8.43726Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'perfil':
        return <PerfilSection />;
      case 'clientes':
        return <ClientesSection />;
      case 'servicios':
        return <ServiciosSection />;
      default:
        return <PerfilSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <DashNav 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        menuItems={customMenuItems}
      />
      
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeSection === 'perfil' ? 'Dashboard' : activeSection}
            </h1>
          </div>
        </header>

        
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
