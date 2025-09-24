import React from 'react';

export default function IngredientItem({ ingredient, onDragStart, onDragEnd, isDragging }) {
  return (
    <div
      className={`select-none cursor-grab active:cursor-grabbing rounded-lg border ring-1 ring-gray-200 bg-white p-4 shadow-sm hover:shadow transition ${isDragging ? 'opacity-50' : ''}`}
      draggable
      onDragStart={(e) => {
        try { e.dataTransfer.setData('application/json', JSON.stringify(ingredient)); } catch {}
        e.dataTransfer.effectAllowed = 'move';
        window.draggedIngredient = ingredient;
        if (onDragStart) onDragStart(ingredient);
      }}
      onDragEnd={() => {
        delete window.draggedIngredient;
        if (onDragEnd) onDragEnd();
      }}
    >
      <div className="text-3xl text-center mb-2">{ingredient.emoji ?? '🛒'}</div>
      <div className="text-sm font-semibold text-gray-900 text-center">{ingredient.name}</div>
      <div className="text-xs text-gray-600 text-center">Price: ${ingredient.price}</div>
    </div>
  );
}
