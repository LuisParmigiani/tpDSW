import styles from './PaginationControler.module.css';
import { useState, useEffect } from 'react';
type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className={styles.paginationControls}>
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className={styles.button}
        aria-label="Página anterior"
      >
        {isMobile ? '← ' : '← Anterior  '}
      </button>

      <span className={styles.pageInfo}>
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className={styles.button}
        aria-label="Página siguiente"
      >
        {isMobile ? ' →' : 'Siguiente →'}
      </button>
    </div>
  );
}
export default PaginationControls;
