type DashboardSectionProps = {
  children: React.ReactNode;
  className?: string;
};

function DashboardSection({ children, className = "" }: DashboardSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  );
}

export default DashboardSection;
