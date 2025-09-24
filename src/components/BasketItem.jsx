import React from 'react';

export default function BasketItem({ basket, onDrop, onDragStart, onDragEnd, onRemoveIngredient }) {
  const handleDropInternal = (e) => {
    e.preventDefault();
    let data = window.draggedIngredient;
    if (!data) {
      try {
        const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (raw) data = JSON.parse(raw);
      } catch {}
    }
    if (data && onDrop) onDrop(basket.id, data);
  };

  return (
    <div
      className="w-[360px] min-h-[220px] rounded-xl border-2 border-dashed border-gray-300 bg-white/80 backdrop-blur-sm p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropInternal}
    >
      <div className="text-center text-gray-600 mb-4">Drop ingredients here</div>
      <ul className="grid grid-cols-3 gap-3">
        {basket.items.map((item) => (
          <li key={item.id} className="relative">
            <div
              className="rounded-lg ring-1 ring-gray-200 bg-white p-3 text-center shadow-sm"
              draggable
              onDragStart={() => onDragStart && onDragStart(item)}
              onDragEnd={() => onDragEnd && onDragEnd()}
            >
              <div className="text-2xl">{item.emoji ?? '🥗'}</div>
              <div className="text-xs mt-1">{item.name}</div>
              <div className="text-[10px] text-gray-600">${item.price}</div>
            </div>
            {onRemoveIngredient && (
              <button
                aria-label={`Remove ${item.name}`}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs leading-6"
                onClick={() => onRemoveIngredient(basket.id, item.id)}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
