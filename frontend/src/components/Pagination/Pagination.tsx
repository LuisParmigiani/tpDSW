import React, { useState, useMemo } from 'react';
import PaginationControls from './PaginationControler';
import styles from './pagination.module.css';

type Props = {
  elements: React.ReactNode[];
  maxElementsPerPage?: number;
  showInfo?: boolean;
  title?: string;
};

function Pagination({
  elements,
  maxElementsPerPage = 5,
  showInfo = true,
  title,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentElements = useMemo(() => {
    const startIndex = (currentPage - 1) * maxElementsPerPage;
    const endIndex = startIndex + maxElementsPerPage;
    return elements.slice(startIndex, endIndex);
  }, [elements, currentPage, maxElementsPerPage]);

  const totalPages = Math.ceil(elements.length / maxElementsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [elements, totalPages, currentPage]);

  if (!elements || elements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={styles.titlePag}>
      {(showInfo || title) && <div>{title && <h1>{title} </h1>}</div>}

      <div className="space-y-6">
        {currentElements.map((element, index) => {
          const realIndex = (currentPage - 1) * maxElementsPerPage + index;
          return (
            <div key={`element-${realIndex}`} className="animate-fadeIn">
              {element}
            </div>
          );
        })}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Pagination;
