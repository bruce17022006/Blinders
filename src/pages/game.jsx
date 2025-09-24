import React, { useEffect, useMemo, useState } from 'react';
import IngredientItem from '../components/IngredientItem.jsx';
import BasketItem from '../components/BasketItem.jsx';
import DragPreview from '../components/DragPreview.jsx';
import { useDragAndDrop } from '../hooks/useDragAndDrop.js';
import { availableIngredients } from '../data/ingredients.js';
import { useGameStore } from '../store.jsx';

const STARTING_BUDGET = 80;
const THRESHOLD = { proteinMin: 30, fatMax: 25, carbsMax: 120, caloriesMax: 800 };
const BG_URL = 'https://cdn.builder.io/api/v1/image/assets%2F638bfe23d3f545968316aeab99de9804%2F7b37b11927f646698f8b1af877c64385?format=webp&width=1600';

export default function Game() {
  const {
    dragState,
    baskets,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleRemoveIngredient,
    updateDragPosition,
  } = useDragAndDrop();

  const addPoints = useGameStore((s) => s.addPoints);
  const points = useGameStore((s) => s.points);

  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState('');

  const totals = useMemo(() => {
    const items = baskets[0]?.items || [];
    return items.reduce(
      (acc, it) => ({
        cost: acc.cost + (it.price || 0),
        protein: acc.protein + (it.protein || 0),
        fat: acc.fat + (it.fat || 0),
        carbs: acc.carbs + (it.carbs || 0),
        calories: acc.calories + (it.calories || 0),
      }),
      { cost: 0, protein: 0, fat: 0, carbs: 0, calories: 0 }
    );
  }, [baskets]);

  const budgetLeft = STARTING_BUDGET - totals.cost;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragState.isDragging) {
        updateDragPosition(e.clientX, e.clientY);
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [dragState.isDragging, updateDragPosition]);

  const handleIngredientDrop = (basketId, ingredient) => {
    const draggedIngredient = window.draggedIngredient || ingredient;
    if (!draggedIngredient) return;

    const nextCost = totals.cost + (draggedIngredient.price || 0);
    if (nextCost > STARTING_BUDGET) {
      setMessage('Budget exceeded. Remove something or pick cheaper items.');
      return;
    }
    setMessage('');
    handleDrop(basketId, draggedIngredient);
  };

  const submitBasket = () => {
    const pass =
      totals.protein >= THRESHOLD.proteinMin &&
      totals.fat <= THRESHOLD.fatMax &&
      totals.carbs <= THRESHOLD.carbsMax &&
      totals.calories <= THRESHOLD.caloriesMax;

    if (!pass) {
      const reasons = [];
      if (totals.protein < THRESHOLD.proteinMin) reasons.push('Protein is low');
      if (totals.fat > THRESHOLD.fatMax) reasons.push('Fat is high');
      if (totals.carbs > THRESHOLD.carbsMax) reasons.push('Carbs are high');
      if (totals.calories > THRESHOLD.caloriesMax) reasons.push('Calories are high');
      addPoints(-15);
      setMessage(`Not quite right (-15 pts). ${reasons.join('. ')}. Try lean protein and lower-calorie picks.`);
      return;
    }

    const bonus = Math.max(5, Math.round(budgetLeft));
    addPoints(bonus);
    setMessage(`Great combo! +${bonus} points for a balanced basket and saving $${budgetLeft}.`);
  };

  if (!started) {
    return (
      <div className="min-h-screen relative">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_URL})`, filter: 'blur(6px) brightness(0.9)' }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-3">Market Basket Challenge</h1>
            <p className="text-gray-700 mb-6">Build a high-nutrition, low-cost basket within your $50 purse.</p>
            <button
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              onClick={() => setStarted(true)}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${BG_URL})`, filter: 'blur(3px) brightness(0.95)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-indigo-50/40 to-slate-50/40" />

      <div className="fixed top-3 right-3 z-20 bg-gray-900/70 text-white rounded-lg px-3 py-2 text-xs shadow-lg">
        <div>Points: {points}</div>
        <div>Purse: ${budgetLeft}</div>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 drop-shadow-lg">🛒 Market Basket Shop</h1>
          <p className="text-lg text-gray-700 drop-shadow">Drag ingredients into your basket and stay under budget.</p>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-3 gap-6 mb-6">
              {availableIngredients.map((ingredient) => (
                <div key={ingredient.id} className="flex justify-center">
                  <IngredientItem
                    ingredient={ingredient}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={dragState.draggedItem?.id === ingredient.id}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <BasketItem
                basket={baskets[0]}
                onDrop={handleIngredientDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onRemoveIngredient={handleRemoveIngredient}
              />

              {message && (
                <div className={`text-sm ${message.includes('Great') ? 'text-emerald-700' : 'text-red-600'}`}>{message}</div>
              )}

              <button
                className="mt-2 px-5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                onClick={submitBasket}
              >
                Submit Basket
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg ring-1 ring-gray-200 p-4 text-sm text-gray-700">
          <div className="font-semibold mb-1">Thresholds</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Protein ≥ {THRESHOLD.proteinMin} g</li>
            <li>Fat ≤ {THRESHOLD.fatMax} g</li>
            <li>Carbs ≤ {THRESHOLD.carbsMax} g</li>
            <li>Calories ≤ {THRESHOLD.caloriesMax}</li>
          </ul>
        </div>
      </div>

      <DragPreview
        ingredient={dragState.draggedItem}
        position={dragState.dragPosition}
        isVisible={dragState.isDragging}
      />
    </div>
  );
}
