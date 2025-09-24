import { useCallback, useMemo, useState } from 'react';

export function useDragAndDrop() {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedItem: null,
    dragPosition: { x: 0, y: 0 },
  });

  const [baskets, setBaskets] = useState([{ id: 'basket-1', items: [] }]);

  const handleDragStart = useCallback((item) => {
    setDragState((s) => ({ ...s, isDragging: true, draggedItem: item }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState((s) => ({ ...s, isDragging: false, draggedItem: null }));
    delete window.draggedIngredient;
  }, []);

  const updateDragPosition = useCallback((x, y) => {
    setDragState((s) => ({ ...s, dragPosition: { x, y } }));
  }, []);

  const handleDrop = useCallback((basketId, ingredient) => {
    setBaskets((prev) =>
      prev.map((b) =>
        b.id === basketId
          ? {
              ...b,
              items: b.items.some((it) => it.id === ingredient.id)
                ? b.items
                : [...b.items, ingredient],
            }
          : b
      )
    );
    setDragState((s) => ({ ...s, isDragging: false, draggedItem: null }));
    delete window.draggedIngredient;
  }, []);

  const handleRemoveIngredient = useCallback((basketId, ingredientId) => {
    setBaskets((prev) =>
      prev.map((b) =>
        b.id === basketId
          ? { ...b, items: b.items.filter((it) => it.id !== ingredientId) }
          : b
      )
    );
  }, []);

  return useMemo(
    () => ({
      dragState,
      baskets,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleRemoveIngredient,
      updateDragPosition,
    }),
    [dragState, baskets, handleDragStart, handleDragEnd, handleDrop, handleRemoveIngredient, updateDragPosition]
  );
}
