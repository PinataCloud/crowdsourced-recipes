import { GroupResponseItem } from 'pinata';
import React, { useEffect, useState } from 'react'

type CategoriesProps = {
  selectedCategory: GroupResponseItem | null;
  setSelectedCategory: (category: GroupResponseItem) => void
}

const Categories = (props: CategoriesProps) => {
  const [categories, setCategories] = useState<GroupResponseItem[]>([])
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async (category?: string) => {
    const res = await fetch(`/api/categories?category=${category}`)
    const categories = await res.json()
    console.log(categories)
    setCategories(categories.data)
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
        {categories.length > 0 && categories.map((category: GroupResponseItem) => (
          <button onClick={() => props.setSelectedCategory(category)} key={category.id} className="whitespace-nowrap bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
            {category.name}
          </button>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Categories