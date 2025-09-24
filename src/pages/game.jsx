import React, { useEffect, useRef } from 'react';
import kaplay from 'kaplay';
// We will import our game store later to connect the score
// import { useGameStore } from '../store';

export default function ZeroHungerGame() {
  const canvasRef = useRef(null);
  const isInitialized = useRef(false); // Our guard flag to prevent re-initialization

  // The useEffect hook is crucial. It ensures our game code runs only once,
  // right after the <canvas> element has been created and is ready.
  useEffect(() => {
    // In React's Strict Mode, this effect might run twice. This guard prevents that.
    if (isInitialized.current || !canvasRef.current) {
      return;
    }
    isInitialized.current = true;

    // --- KAPLAY INITIALIZATION ---
    const k = kaplay({
      canvas: canvasRef.current,
      width: 800,
      height: 600,
      background: [240, 230, 220], // A warm kitchen color
    });

    // --- MOCK ZUSTAND STORE FOR TESTING ---
    // In the real app, we'll get this from our store.
    const gameStore = {
      addCoins: (amount) => {
        console.log(`Awarded ${amount} coins!`);
        // This is where you'd call the actual store function
      }
    };
    
    // --- GAME ASSETS & CONFIG ---
    // In a hackathon, we use simple shapes instead of loading images.
    const PLAYER_SPEED = 320;
    const TIMER_SECONDS = 30;

    // --- GAME SCENES ---
    // Kaplay uses "scenes" to separate parts of your game (e.g., menu, game, game over).

    // The main game scene
    k.scene('main', () => {
      // --- UI & GAME STATE ---
      let score = 0;
      let timer = TIMER_SECONDS;
      const collectedIngredients = [];

      const scoreLabel = k.add([
        k.text(`Score: ${score}`),
        k.pos(24, 24),
        k.fixed(),
      ]);

      const timerLabel = k.add([
        k.text(`Time: ${timer}`),
        k.pos(k.width() - 150, 24),
        k.fixed(),
      ]);

      // --- PLAYER SETUP ---
      const player = k.add([
        k.rect(40, 60),
        k.pos(k.center().x, k.height() - 80),
        k.color(0, 0, 255),
        k.anchor('center'),
        k.area(), // Gives it a hitbox for collisions
        k.body(), // Gives it physics properties
        'player',
      ]);

      k.onKeyDown('left', () => player.move(-PLAYER_SPEED, 0));
      k.onKeyDown('right', () => player.move(PLAYER_SPEED, 0));

      // --- STATIONS & KITCHEN LAYOUT ---
      const stations = {
        protein: { x: 100, color: k.rgb(0, 200, 0), name: 'protein' },
        carbs: { x: k.center().x, color: k.rgb(255, 180, 0), name: 'carbs' },
        veggies: { x: k.width() - 100, color: k.rgb(255, 100, 100), name: 'veggies' },
      };

      for (const station of Object.values(stations)) {
        k.add([
          k.rect(120, 50),
          k.pos(station.x, 100),
          k.color(station.color),
          k.anchor('center'),
          k.area(),
          'station',
          { type: station.name },
        ]);
        k.add([
          k.text(station.name.toUpperCase()),
          k.pos(station.x, 100),
          k.anchor('center'),
          k.color(0,0,0)
        ]);
      }
      
      const plateStation = k.add([
          k.rect(150, 40),
          k.pos(k.center().x, k.height() - 200),
          k.color(200, 200, 200),
          k.anchor('center'),
          k.area(),
          'plateStation'
      ]);

      // --- CUSTOMER & ORDER LOGIC ---
      let currentOrder = ['protein', 'carbs']; // Example order

      const customer = k.add([
          k.rect(60, 80),
          k.pos(k.width() - 80, k.height() - 120),
          k.color(k.rgb(200, 50, 50))
      ]);
      
      const orderDisplay = k.add([
          k.text(`Order: ${currentOrder.join(', ')}`),
          k.pos(k.center().x, k.height() - 20),
          k.anchor('center')
      ]);

      // --- GAMEPLAY INTERACTIONS ---
      player.onCollide('station', (station) => {
        // Simple mini-game: mash the space bar
        if(k.isKeyPressed('space')) {
           const ingredientType = station.type;
           if (!collectedIngredients.includes(ingredientType)) {
               collectedIngredients.push(ingredientType);
               k.addKaboom(player.pos); // Fun effect!
               // Update UI to show collected items
               orderDisplay.text = `Collected: ${collectedIngredients.join(', ')}`
           }
        }
      });
      
      player.onCollide('plateStation', () => {
         if(k.isKeyPressed('space')) {
            // Check if collected items match the order
            const orderSet = new Set(currentOrder);
            const collectedSet = new Set(collectedIngredients);
            
            if (orderSet.size === collectedSet.size && [...orderSet].every(value => collectedSet.has(value))) {
                score += 100;
                gameStore.addCoins(100);
                k.go('main'); // Restart level for demo
            } else {
                k.go('lose');
            }
         }
      });

      // --- TIMER ---
      k.loop(1, () => {
        timer--;
        timerLabel.text = `Time: ${timer}`;
        if (timer <= 0) {
          k.go('lose');
        }
      });
    });

    // The "Game Over" scene
    k.scene('lose', () => {
      k.add([
        k.text('Game Over!', { size: 64 }),
        k.pos(k.center()),
        k.anchor('center'),
      ]);
       k.add([
        k.text('Press Space to Retry', { size: 24 }),
        k.pos(k.center().x, k.center().y + 50),
        k.anchor('center'),
      ]);
      k.onKeyPress('space', () => k.go('main'));
    });

    // --- START THE GAME ---
    k.go('main');

    // Return the cleanup function. React will call this when the component unmounts.
    return () => {
        k.destroy();
        isInitialized.current = false; // Reset the flag if the component truly unmounts
    };

  }, []); // The empty array [] ensures this useEffect runs only ONCE.

  return (
    // This canvas is where our Kaplay game will live.
    // We make it focusable so it can receive keyboard input.
    <div className="w-full h-screen flex justify-center items-center bg-gray-900">
       <canvas ref={canvasRef} tabIndex="0"></canvas>
    </div>
  );
}




// import React, { useState, useMemo } from 'react';

// // --- Game Configuration ---
// const STARTING_BUDGET = 50;
// const MAX_ITEMS = 6;
// const TARGET_NUTRIENTS = {
//   protein: { min: 30, ideal: 40 },
//   carbs: { min: 40, ideal: 55 },
//   fiber: { min: 15, ideal: 20 },
//   fats: { max: 25 },
// };

// // --- Ingredient Data with Macronutrients ---
// const ALL_INGREDIENTS = [
//   { id: 1, name: 'Lentils', emoji: '🍲', cost: 15, nutrients: { protein: 20, carbs: 30, fiber: 15, fats: 2 } },
//   { id: 2, name: 'Eggs', emoji: '🥚', cost: 20, nutrients: { protein: 25, carbs: 2, fiber: 0, fats: 10 } },
//   { id: 3, name: 'Chicken', emoji: '🍗', cost: 25, nutrients: { protein: 35, carbs: 0, fiber: 0, fats: 8 } },
//   { id: 4, name: 'Spinach', emoji: '🥬', cost: 12, nutrients: { protein: 5, carbs: 7, fiber: 8, fats: 1 } },
//   { id: 5, name: 'Rice', emoji: '🍚', cost: 10, nutrients: { protein: 5, carbs: 40, fiber: 2, fats: 1 } },
//   { id: 6, name: 'Milk', emoji: '🥛', cost: 8, nutrients: { protein: 8, carbs: 12, fiber: 0, fats: 5 } },
//   { id: 7, name: 'Fries', emoji: '🍟', cost: 10, nutrients: { protein: 3, carbs: 35, fiber: 3, fats: 20 } },
//   { id: 8, name: 'Soda', emoji: '🥤', cost: 7, nutrients: { protein: 0, carbs: 40, fiber: 0, fats: 0 } },
//   { id: 9, name: 'Cake Slice', emoji: '🍰', cost: 15, nutrients: { protein: 2, carbs: 50, fiber: 1, fats: 25 } },
// ];

// const NutrientTracker = ({ name, value, target }) => {
//   const isOverMax = target.max && value > target.max;
//   const isUnderMin = target.min && value < target.min;
//   const percentage = target.min ? Math.min((value / target.ideal) * 100, 100) : (value / target.max) * 100;

//   let bgColor = 'bg-blue-400';
//   if (name === 'Protein') bgColor = 'bg-green-400';
//   if (isOverMax) bgColor = 'bg-red-500';

//   let textColor = 'text-gray-700';
//   if (isOverMax || isUnderMin) textColor = 'text-red-600 font-bold';
//   else if (target.min && value >= target.min) textColor = 'text-green-600 font-bold';

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-1">
//         <span className="text-sm font-semibold">{name}</span>
//         <span className={`text-sm ${textColor}`}>
//           {value} / {target.min ? `${target.min}+` : `Max ${target.max}`}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2.5">
//         <div className={`${bgColor} h-2.5 rounded-full transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }}></div>
//       </div>
//     </div>
//   );
// };

// export default function ZeroHungerGame() {
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [gameState, setGameState] = useState('playing');
//   const [feedback, setFeedback] = useState('');
//   const [draggedItem, setDraggedItem] = useState(null);
//   const [isDropZoneActive, setIsDropZoneActive] = useState(false);

//   const currentCost = useMemo(() => selectedItems.reduce((sum, item) => sum + item.cost, 0), [selectedItems]);

//   const currentNutrients = useMemo(() => {
//     const totals = { protein: 0, carbs: 0, fiber: 0, fats: 0 };
//     selectedItems.forEach(item => {
//       totals.protein += item.nutrients.protein;
//       totals.carbs += item.nutrients.carbs;
//       totals.fiber += item.nutrients.fiber;
//       totals.fats += item.nutrients.fats;
//     });
//     return totals;
//   }, [selectedItems]);

//   const handleSelectItem = (ingredient) => {
//     if (selectedItems.find(item => item.id === ingredient.id)) return;
//     if (selectedItems.length >= MAX_ITEMS || currentCost + ingredient.cost > STARTING_BUDGET) {
//       return;
//     }
//     setSelectedItems([...selectedItems, ingredient]);
//   };

//   const handleRemoveItem = (itemToRemove) => {
//     setSelectedItems(selectedItems.filter(item => item.id !== itemToRemove.id));
//   };

//   const handleSubmitMeal = () => {
//     const { protein, carbs, fiber, fats } = currentNutrients;
//     if (protein < TARGET_NUTRIENTS.protein.min) {
//       setFeedback('This meal is too low in protein, essential for growth.');
//       setGameState('lost');
//     } else if (carbs < TARGET_NUTRIENTS.carbs.min) {
//       setFeedback('Not enough carbohydrates for energy.');
//       setGameState('lost');
//     } else if (fiber < TARGET_NUTRIENTS.fiber.min) {
//       setFeedback('This meal lacks fiber, important for digestive health.');
//       setGameState('lost');
//     } else if (fats > TARGET_NUTRIENTS.fats.max) {
//       setFeedback('This meal is too high in unhealthy fats.');
//       setGameState('lost');
//     } else {
//       setFeedback('A well-balanced meal! You met all nutritional goals.');
//       setGameState('won');
//     }
//   };

//   const handleRestart = () => {
//     setSelectedItems([]);
//     setGameState('playing');
//     setFeedback('');
//   };

//   // --- Drag and Drop Handlers ---
//   const handleDragStart = (e, ingredient) => {
//     const isSelected = selectedItems.some(item => item.id === ingredient.id);
//     const canAfford = currentCost + ingredient.cost <= STARTING_BUDGET;
//     const isFull = selectedItems.length >= MAX_ITEMS;
//     if(isSelected || !canAfford || isFull) {
//       e.preventDefault();
//       return;
//     }
//     setDraggedItem(ingredient);
//   };
  
//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (draggedItem) {
//       handleSelectItem(draggedItem);
//     }
//     setDraggedItem(null);
//     setIsDropZoneActive(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     if (draggedItem) setIsDropZoneActive(true);
//   };
  
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDropZoneActive(false);
//   }

//   if (gameState === 'won' || gameState === 'lost') {
//     const isWin = gameState === 'won';
//     return (
//       <div className={`min-h-screen ${isWin ? 'bg-green-100' : 'bg-red-100'} flex flex-col justify-center items-center p-4`}>
//         <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg">
//           <h1 className={`text-4xl font-bold ${isWin ? 'text-green-600' : 'text-red-600'} mb-4`}>{isWin ? 'Success! 🎉' : 'Imbalanced Meal 😟'}</h1>
//           <p className="text-lg text-gray-700 mb-6">{feedback}</p>
//           <div className="text-left space-y-2 text-sm"><p><strong>Your Meal's Stats:</strong></p><p>Protein: {currentNutrients.protein}g</p><p>Carbs: {currentNutrients.carbs}g</p><p>Fiber: {currentNutrients.fiber}g</p><p>Fats: {currentNutrients.fats}g</p></div>
//           <button onClick={handleRestart} className={`mt-6 w-full ${isWin ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded`}>{isWin ? 'Play Again' : 'Try Again'}</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-yellow-100 p-4 sm:p-8 flex flex-col items-center font-sans">
//       <div className="w-full max-w-5xl">
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-yellow-900">SDG 2: Meal Balance Challenge</h1>
//           <p className="text-lg text-gray-600 mt-2">Drag ingredients to the plate to design a balanced meal.</p>
//         </div>

//         {/* --- Market --- */}
//         <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
//            <h2 className="text-xl font-semibold mb-3 text-center text-gray-700">Market</h2>
//            <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100 rounded-md">
//             {ALL_INGREDIENTS.map(ingredient => {
//                 const isSelected = selectedItems.some(item => item.id === ingredient.id);
//                 const canAfford = currentCost + ingredient.cost <= STARTING_BUDGET;
//                 const isDisabled = isSelected || !canAfford || selectedItems.length >= MAX_ITEMS;
//               return (
//                 <div 
//                   key={ingredient.id}
//                   draggable={!isDisabled}
//                   onDragStart={(e) => handleDragStart(e, ingredient)}
//                   className={`flex-shrink-0 p-3 border rounded-lg flex flex-col items-center text-center w-28 h-36 justify-between transition-all ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab bg-white hover:shadow-lg hover:-translate-y-1'}`}
//                 >
//                   <span className="text-4xl">{ingredient.emoji}</span>
//                   <div className="w-full">
//                     <span className="text-sm font-bold block">{ingredient.name}</span>
//                     <span className="text-xs text-gray-600">Cost: {ingredient.cost}</span>
//                      <div className="text-left text-xs mt-1 w-full"><p className="text-green-600">P: {ingredient.nutrients.protein}</p><p className="text-blue-600">C: {ingredient.nutrients.carbs}</p><p className="text-red-600">F: {ingredient.nutrients.fats}</p></div>
//                   </div>
//                 </div>
//               );
//             })}
//            </div>
//         </div>
        
//         {/* --- Workspace --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* --- Plate Dropzone --- */}
//           <div 
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             className={`bg-white p-6 rounded-lg shadow-md transition-colors duration-300 ${isDropZoneActive ? 'bg-yellow-200' : ''}`}
//           >
//             <h2 className="text-2xl font-semibold mb-4 text-center">Your Plate ({selectedItems.length} / {MAX_ITEMS})</h2>
//             <div className="min-h-[200px] bg-gray-50 p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-4 justify-center items-center">
//               {selectedItems.length > 0 ? selectedItems.map(item => (
//                 <div key={`${item.id}-${Math.random()}`} className="text-center group relative">
//                   <span className="text-5xl">{item.emoji}</span>
//                   <p className="text-xs">{item.name}</p>
//                    <button onClick={() => handleRemoveItem(item)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
//                 </div>
//               )) : <p className="text-gray-400 self-center">Drag ingredients here...</p>}
//             </div>
//           </div>
          
//           {/* --- Status & Nutrients --- */}
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <h2 className="text-2xl font-semibold mb-4">Nutrient Balance</h2>
//             <div className="space-y-3 mb-4">
//               <NutrientTracker name="Protein" value={currentNutrients.protein} target={TARGET_NUTRIENTS.protein} />
//               <NutrientTracker name="Carbs" value={currentNutrients.carbs} target={TARGET_NUTRIENTS.carbs} />
//               <NutrientTracker name="Fiber" value={currentNutrients.fiber} target={TARGET_NUTRIENTS.fiber} />
//               <NutrientTracker name="Fats" value={currentNutrients.fats} target={TARGET_NUTRIENTS.fats} />
//             </div>
//             <div className="flex justify-between items-center mt-6">
//               <p className="text-lg font-semibold">Budget: <span className="font-bold text-yellow-800">{STARTING_BUDGET - currentCost}</span></p>
//               <button onClick={handleSubmitMeal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300" disabled={selectedItems.length === 0}>Finish Meal</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

