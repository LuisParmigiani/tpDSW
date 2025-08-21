interface SelectionBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  fadeOut: boolean;
  children?: React.ReactNode;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  onDeselectAll,
  showMenu,
  setShowMenu,
  fadeOut,
  children,
}) => (
  <div className={`fixed left-0 bottom-0 w-full z-50 flex items-center justify-center ${fadeOut ? 'fade-out' : 'fade-in'}`}>
    <div className="bg-gray-900 text-white rounded-t-lg shadow-lg px-6 py-4 flex items-center gap-6 min-w-[320px] max-w-md">
      <span className="font-semibold">Seleccionados: {selectedCount}</span>
      <div className="relative">
        <button
          className="bg-transparent text-white px-4 py-2 rounded transition font-medium hover:underline flex items-center gap-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          Actualizar estado
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M6 12L10 8L14 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-gray-700 rounded shadow-lg py-2 w-40 z-50">
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => setShowMenu(false)}>Confirmar</button>
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => setShowMenu(false)}>Cancelar</button>
          </div>
        )}
      </div>
      <button
        className="ml-auto text-gray-300 hover:text-white text-xl font-bold px-2"
        onClick={onDeselectAll}
        title="Deseleccionar todo"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

export default SelectionBar;
