interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DashboardSection({ title, children, className = "" }: DashboardSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default DashboardSection;
