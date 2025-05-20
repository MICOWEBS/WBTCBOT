import React from 'react';

export default function Pagination({ page, setPage }) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        className="px-2 py-1 bg-gray-700 rounded text-xs"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </button>
      <span className="text-xs">Page {page}</span>
      <button
        className="px-2 py-1 bg-gray-700 rounded text-xs"
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );
} 