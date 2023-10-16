const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const pages = [];

  // Array of page numbers
  for (let i = 1; i <= Math.min(totalPages, 3); i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  // Logic for displaying pagination dots and last page
  if (totalPages > 3) {
    if (currentPage < totalPages - 1) {
      pages.push(<span key="dots">...</span>);
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
