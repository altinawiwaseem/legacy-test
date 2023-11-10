import "./pagination.css";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const pages = [];

  pages.push(
    <button
      className="btn"
      key={1}
      onClick={() => handlePageChange(1)}
      disabled={currentPage === 1}
    >
      {1}
    </button>
  );

  // Determine the start page for the middle pages
  let startPage = Math.max(2, currentPage - 1);

  // Ensure we show at least 3 middle pages
  if (totalPages - startPage < 3) {
    startPage = Math.max(2, totalPages - 3);
  }

  // Array of middle page numbers
  for (let i = startPage; i < startPage + Math.min(totalPages - 2, 3); i++) {
    pages.push(
      <button
        className="btn"
        key={i}
        onClick={() => handlePageChange(i)}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  // The three dots if there are pages between the current page and the last page
  if (totalPages > startPage + 2) {
    pages.push(<span key="dots">...</span>);
  }

  // Always add the last page if there are more than one page
  if (totalPages > 1) {
    pages.push(
      <button
        className="btn"
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="pagination ">
      <button
        className="btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages}
      <button
        className="btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
