import { GroupResponseItem, PinListItem } from 'pinata'
import React, { useEffect, useState } from 'react'
import pinata from '../pinata'

type RecipesProps = {
  selectedCategory: GroupResponseItem | null
}

type DataProps = {
  image: string;
  recipe: string;
}

const Recipes = (props: RecipesProps) => {
  const [recipes, setRecipes] = useState<PinListItem[]>([])
  const [see, setSee] = useState<PinListItem | null>(null)

  useEffect(() => {
    loadRecipes(props.selectedCategory)
  }, [props.selectedCategory]);

  const loadRecipes = async (category?: GroupResponseItem | null) => {
    const res = await fetch(`/api/recipes?category=${category?.id}`)
    const data = await res.json()
    const recipeData = data.data;
    for(const recipe of recipeData) {
      recipe.data = await loadData(recipe.ipfs_pin_hash)
    }
    setRecipes(recipeData)
  }

  const loadData = async (cid: string) => {
    //  load the main CID
    const file = await pinata.gateways.get(cid)
    return file.data
  }
  return (
    <div className="w-1/2 m-auto mt-10">
      {
        recipes.length > 0 ?
          recipes.map((r: any) => {            
            return (
              <div className="w-full border border-black rounded-md shadow" key={r.id}>
                <img className="w-full" src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${r?.data?.image}`} />
                <div className="p-6">
                  <h3>{r.metadata.name}</h3>
                  <p>{r?.metadata?.keyvalues?.author}</p>
                  <p>{new Date(r.date_pinned).toLocaleDateString()}</p>
                  <button onClick={see && see.id === r.id ? () => setSee(null) : () => setSee(r)}>{see && see.id === r.id ? "Hide recipe" : "See recipe"}</button>
                  {
                    see && see.id === r.id &&
                    <div>
                      {r.data?.recipe}
                    </div>
                  }
                </div>
              </div>
            )
          }) :
          <div className="mt-10 w-full m-auto flex flex-col items-center">
            <p className="text-center">No recipes yet, why don't you change that?</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-20 w-20 mt-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
      }
    </div>
  )
}

export default Recipes