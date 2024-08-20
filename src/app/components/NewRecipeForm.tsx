import React, { useState, useRef } from 'react';
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "dfdfgdf",
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

type NewRecipeFormProps = {
  setNewRecipe: (option: boolean) => void;
};

const NewRecipeForm = (props: NewRecipeFormProps) => {
  const [recipeName, setRecipeName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('');
  const [recipe, setRecipe] = useState('');
  const [recipeImage, setRecipeImage] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    setRecipeName('');
    setAuthorName('');
    setCategory('');
    setRecipe('');
    setRecipeImage('');
  };

  const cancel = () => {
    clear();
    props.setNewRecipe(false);
  };

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecipeImage(e.target.files[0]);
    }
  };

  const save = async (e: any) => {
    e.preventDefault()
    try {
      //  get one time token
      //  remember in a production app to add some authentication
      const res = await fetch("/api/auth")
      const tokenData = await res.json()
      const token = tokenData.data;  
      //  Upload image
      const data = await pinata.upload.file(recipeImage).key(token)

      //  Create category if it doesn't exist
      await fetch("/api/categories", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: category
        })
      })

      //  Upload the recipe
      const recipeObj = {
        recipe: {
          recipe: recipe,
          image: data.IpfsHash
        },
        category,
        author: authorName,
        recipeName: recipeName
      }

      await fetch("/api/recipes", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeObj)
      })
      cancel()
    } catch (error) {
      console.log(error)
      alert("Trouble saving recipe, please try again")
    }
  }

  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold">New Recipe</h1>
      <form onSubmit={save}>
        <div className="mt-6 flex items-center">
          <label className="w-40" htmlFor="recipeName">Recipe Name</label>
          <input
            className="py-2 px-4 border border-white rounded-md text-white bg-black w-full"
            type="text"
            id="recipeName"
            value={recipeName}
            placeholder="Southwestern Enchiladas"
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </div>
        <div className="mt-6 flex items-center">
          <label className="w-40" htmlFor="authorName">Author Name</label>
          <input
            className="py-2 px-4 border border-white rounded-md text-white bg-black w-full"
            type="text"
            id="authorName"
            value={authorName}
            placeholder="Sandra Parker"
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div className="mt-6 flex items-center">
          <label className="w-40" htmlFor="category">Category</label>
          <input
            className="py-2 px-4 border border-white rounded-md text-white bg-black w-full"
            type="text"
            id="category"
            value={category}
            placeholder="Hispanic Foods"
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mt-6 flex items-center">
          <label className="w-40" htmlFor="recipeImage">Recipe Image</label>
          <input
            ref={fileInputRef}
            type="file"
            id="recipeImage"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            className="bg-purple-600 p-4 rounded-sm text-white ml-4"
            onClick={handleImageSelect}
            type="button"
          >
            Upload Image
          </button>
        </div>
        <div className="mt-6 flex items-center">
          <label className="w-40" htmlFor="recipe">Recipe</label>
          <textarea
            className="rounded border p-4 bg-black text-white outline-none w-full h-32"
            id="recipe"
            value={recipe}
            placeholder="Enter the recipe details here..."
            onChange={(e) => setRecipe(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-20">
          <div className="flex justify-end">
            <button onClick={cancel}>Cancel</button>
            <button type="submit" className="bg-purple-600 p-4 rounded-sm text-white ml-4">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipeForm;