type SelectionBarProps = {
  selectedCount: number;
  onDeselectAll: () => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  fadeOut: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  onDeselectAll,
  showMenu,
  setShowMenu,
  fadeOut,
  onConfirm,
  onCancel,
  children,
}) => (
  <div className={`fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 flex items-center justify-center ${fadeOut ? 'fade-out' : 'fade-in'}`}>
    <div className="bg-gray-900 text-white rounded-lg shadow-2xl px-6 py-2 flex items-center gap-4 min-w-[320px] max-w-md">
      <span className="font-semibold whitespace-nowrap">Seleccionados: {selectedCount}</span>
      <div className="relative">
        <button
          className="bg-transparent text-white px-4 py-2 rounded transition font-medium hover:underline flex items-center gap-2 whitespace-nowrap"
          onClick={() => setShowMenu(!showMenu)}
        >
          Actualizar estado
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M6 12L10 8L14 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-gray-700 rounded shadow-lg py-2 w-40 z-50">
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => { if (onConfirm) { onConfirm(); } setShowMenu(false); }}>Confirmar</button>
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => { if (onCancel) { onCancel(); } setShowMenu(false); }}>Cancelar</button>
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
