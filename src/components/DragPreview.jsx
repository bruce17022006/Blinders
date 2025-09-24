import React from 'react';

export default function DragPreview({ ingredient, position, isVisible }) {
  if (!isVisible || !ingredient) return null;
  const { x = 0, y = 0 } = position || {};
  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className="rounded-lg ring-1 ring-gray-300 bg-white px-3 py-2 shadow-lg">
        <span className="mr-2">{ingredient.emoji ?? '🧺'}</span>
        <span className="text-sm font-medium text-gray-800">{ingredient.name}</span>
      </div>
    </div>
  );
}
