import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../store';
import { generateLevelData } from '../llm'; // <-- The magic connection to our AI

// --- Note: The following imports are assumed to exist from your provided code ---
// You will need to make sure the paths are correct for your project structure.
import IngredientItem from '../components/IngredientItem.jsx';
import BasketItem from '../components/BasketItem.jsx';
import DragPreview from '../components/DragPreview.jsx';
import { useDragAndDrop } from '../hooks/useDragAndDrop.js';

// --- Static constants from your original code ---
const BG_URL = 'https://cdn.builder.io/api/v1/image/assets%2F638bfe23d3f545968316aeab99de9804%2F7b37b11927f646698f8b1af877c64385?format=webp&width=1600';

export default function Game() {
  // --- LLM and Level State ---
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);

  // --- Game State and Logic ---
  const { dragState, baskets, handleDragStart, handleDragEnd, handleDrop, handleRemoveIngredient, updateDragPosition, resetBaskets } = useDragAndDrop();
  const addPoints = useGameStore((s) => s.addPoints);
  const points = useGameStore((s) => s.points);
  const [message, setMessage] = useState('');
  const [submissionSummary, setSubmissionSummary] = useState(null); // To store the results after submission

  // Fetch data from the LLM whenever the level changes
  useEffect(() => {
    const loadLevel = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      setSubmissionSummary(null); // Clear previous submission results
      resetBaskets();
      const data = await generateLevelData(currentLevel);
      if (data) {
        const adaptedIngredients = data.ingredients.map(ing => ({ ...ing, price: ing.cost }));
        setLevelData({ ...data, ingredients: adaptedIngredients });
      } else {
        setError("Could not load level data from the AI. Please try again.");
      }
      setLoading(false);
    };
    loadLevel();
  }, [currentLevel, resetBaskets]);

  const totals = useMemo(() => {
    const items = baskets[0]?.items || [];
    return items.reduce(
      (acc, it) => ({
        cost: acc.cost + (it.price || 0),
        protein: acc.protein + (it.nutrients.protein || 0),
        fat: acc.fat + (it.nutrients.fats || 0),
        carbs: acc.carbs + (it.nutrients.carbs || 0),
      }),
      { cost: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [baskets]);

  const startingBudget = levelData?.startingBudget || 80;
  const budgetLeft = startingBudget - totals.cost;

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
    if (totals.cost + (draggedIngredient.price || 0) > startingBudget) {
      setMessage('Budget exceeded!');
      return;
    }
    setMessage('');
    handleDrop(basketId, draggedIngredient);
  };

  const submitBasket = () => {
    const THRESHOLD = {
        proteinMin: levelData.targets.protein.min,
        fatMax: levelData.targets.fats.max,
        carbsMin: levelData.targets.carbs.min,
    };
    const pass = totals.protein >= THRESHOLD.proteinMin && totals.fat <= THRESHOLD.fatMax && totals.carbs >= THRESHOLD.carbsMin;
    
    setSubmissionSummary({
        totals,
        targets: THRESHOLD,
        pass,
    });

    if (!pass) {
      addPoints(-15);
      setMessage(`Not quite right (-15 pts). Review your basket's nutrition.`);
      return;
    }

    const baseWinPoints = 50; // Static points for winning the round
    const budgetBonus = Math.max(0, Math.round(budgetLeft)); // Bonus for leftover money
    const totalPointsAwarded = baseWinPoints + budgetBonus;

    addPoints(totalPointsAwarded);
    setMessage(`Great combo! +${totalPointsAwarded} points (${baseWinPoints} base + ${budgetBonus} bonus).`);
  };

  const handleTryAgain = () => {
    resetBaskets();
    setMessage('');
    setSubmissionSummary(null);
  };
  
  // --- Loading and Error Screens ---
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-xl font-semibold animate-pulse">🤖 Generating your mission...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center bg-gray-100">
        <div>
          <p className="text-xl font-semibold text-red-500">{error}</p>
          <button onClick={() => setCurrentLevel(currentLevel)} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded">Retry</button>
        </div>
      </div>
    );
  }

  // --- Main Game Render ---
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${BG_URL})`, filter: 'blur(3px) brightness(0.95)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-indigo-50/40 to-slate-50/40" />
      <div className="fixed top-3 right-3 z-20 bg-gray-900/70 text-white rounded-lg px-3 py-2 text-xs shadow-lg">
        <div>Level: {currentLevel}</div>
        <div>Points: {points}</div>
        <div>Purse: ${budgetLeft} / ${startingBudget}</div>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 drop-shadow-lg">🛒 Market Basket Challenge</h1>
          <p className="text-lg text-gray-700 drop-shadow">Drag ingredients into your basket to meet the targets.</p>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 shadow-lg ring-1 ring-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-center mb-4">Available Ingredients</h3>
              <div className="grid grid-cols-3 gap-4">
                {levelData.ingredients.map((ingredient) => (
                  <IngredientItem
                    key={ingredient.id}
                    ingredient={ingredient}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={dragState.draggedItem?.id === ingredient.id}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <BasketItem basket={baskets[0]} onDrop={handleIngredientDrop} onRemoveIngredient={handleRemoveIngredient} />
              
              {/* --- New Submission Summary Display --- */}
              {submissionSummary ? (
                <div className="w-full mt-4 p-4 rounded-md bg-gray-50 border">
                    <h4 className="font-bold text-center mb-2">Your Basket's Nutrition</h4>
                    <p className={`text-center font-semibold mb-3 ${submissionSummary.pass ? 'text-emerald-700' : 'text-red-800'}`}>{message}</p>
                    <div className="space-y-2 text-sm">
                        <div className={`p-2 rounded flex justify-between items-center ${submissionSummary.totals.protein >= submissionSummary.targets.proteinMin ? 'bg-green-100' : 'bg-red-100'}`}>
                            <span>Protein</span>
                            <span className="font-mono">{submissionSummary.totals.protein}g / {submissionSummary.targets.proteinMin}g (min)</span>
                        </div>
                        <div className={`p-2 rounded flex justify-between items-center ${submissionSummary.totals.carbs >= submissionSummary.targets.carbsMin ? 'bg-green-100' : 'bg-red-100'}`}>
                             <span>Carbs</span>
                             <span className="font-mono">{submissionSummary.totals.carbs}g / {submissionSummary.targets.carbsMin}g (min)</span>
                        </div>
                        <div className={`p-2 rounded flex justify-between items-center ${submissionSummary.totals.fat <= submissionSummary.targets.fatMax ? 'bg-green-100' : 'bg-red-100'}`}>
                             <span>Fat</span>
                             <span className="font-mono">{submissionSummary.totals.fat}g / {submissionSummary.targets.fatMax}g (max)</span>
                        </div>
                    </div>
                    {submissionSummary.pass ? (
                         <button className="mt-4 w-full px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700" onClick={() => setCurrentLevel(currentLevel + 1)}>
                            Next Level &rarr;
                        </button>
                    ) : (
                        <button className="mt-4 w-full px-5 py-2 rounded-md bg-yellow-500 text-yellow-900 text-sm font-semibold hover:bg-yellow-600" onClick={handleTryAgain}>
                            Try Again
                        </button>
                    )}
                </div>
              ) : (
                <>
                  {message && <p className="text-sm font-semibold text-red-600">{message}</p>}
                  <button className="mt-2 px-5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:bg-gray-400" onClick={submitBasket} disabled={baskets[0].items.length === 0}>
                      Submit Basket
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg ring-1 ring-gray-200 p-4 text-sm text-gray-700 max-w-md mx-auto">
          <div className="font-semibold mb-1">Level {currentLevel} Targets</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Protein ≥ {levelData.targets.protein.min} g</li>
            <li>Carbs ≥ {levelData.targets.carbs.min} g</li>
            <li>Fat ≤ {levelData.targets.fats.max} g</li>
          </ul>
        </div>
      </div>
      <DragPreview ingredient={dragState.draggedItem} position={dragState.dragPosition} isVisible={dragState.isDragging} />
    </div>
  );
}