type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-row content-center items-center gap-4 flex-wrap p-4 pt-7">
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className=" lg:hidden bg-naranja-1 border-1  rounded-2xl py-2 px-4 border-naranja-1 text-white hover:bg-orange-100 transition-colors duration-300 hover:text-naranja-1  cursor-pointer disabled:cursor-auto  disabled:opacity-50 disabled:bg-gray-700 disabled:border-gray-800 disabled:hover:text-white"
        aria-label="Página anterior"
      >
        {'← '}
      </button>
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className="hidden lg:block bg-naranja-1 rounded-2xl py-2 px-4 border-2 border-naranja-1 text-white hover:bg-orange-100 transition-colors duration-300 hover:text-naranja-1 cursor-pointer disabled:cursor-auto  disabled:opacity-50 disabled:bg-gray-700 disabled:border-gray-800 disabled:hover:text-white"
        aria-label="Página anterior"
      >
        {'← Anterior  '}
      </button>

      <span className="text-black text-md">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className=" lg:hidden bg-naranja-1  rounded-2xl py-2 px-4 border-1 border-naranja-1 text-white hover:bg-orange-100 transition-colors duration-300 hover:text-naranja-1  cursor-pointer disabled:cursor-auto  disabled:opacity-50 disabled:bg-gray-700 disabled:border-gray-800 disabled:hover:text-white"
        aria-label="Página siguiente"
      >
        {' →'}
      </button>
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className="hidden lg:block bg-naranja-1 rounded-2xl py-2 px-4 border-2 border-naranja-1 text-white hover:bg-orange-100 transition-colors duration-300 hover:text-naranja-1 cursor-pointer disabled:cursor-auto  disabled:opacity-50 disabled:bg-gray-700 disabled:border-gray-800 disabled:hover:text-white"
        aria-label="Página siguiente"
      >
        {' Siguiente →'}
      </button>
    </div>
  );
}
export default PaginationControls;
