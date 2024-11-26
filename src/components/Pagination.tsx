import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="mt-6 flex justify-center gap-2">
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-600"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className="px-4 py-2 text-white">
      Page {currentPage} of {totalPages}
    </span>
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-600"
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);