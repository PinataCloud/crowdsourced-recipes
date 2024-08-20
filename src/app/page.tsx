'use client'
import { useState } from "react";
import Categories from "./components/Categories";
import Recipes from "./components/Recipes";
import { GroupResponseItem } from "pinata";
import NewRecipeForm from "./components/NewRecipeForm";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<GroupResponseItem | null>(null)
  const [newRecipe, setNewRecipe] = useState(false)

  return (
    <div className="min-w-screen min-h-screen">
      <div className="w-3/4 m-auto">
        <div className="flex justify-between py-4">          
          <h1 className="font-extrabold text-4xl">Recipes</h1>
          <button onClick={() => setNewRecipe(true)} className="bg-purple-700 p-4 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        {
          newRecipe ? 
          <NewRecipeForm setNewRecipe={setNewRecipe} /> : 
          <div>
            <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <Recipes selectedCategory={selectedCategory} />
          </div>
        }
      </div>
    </div>
  );
}
