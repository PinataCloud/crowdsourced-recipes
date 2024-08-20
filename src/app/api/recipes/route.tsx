import pinata from "@/app/pinata";
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const category = searchParams.get("category");
    
    let files = []; 

    if(category && category !== 'undefined' && category !== "") {
      files = await pinata.listFiles().keyValue("recipes", "true").group(category).pageLimit(1000)
    } else {
      files = await pinata.listFiles().keyValue("recipes", "true").pageLimit(1000)
    }
    return NextResponse.json({ data: files }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }  
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipe, category, author, recipeName } = body;
    const group = await pinata.groups.create({
      name: category,
    });

    await pinata.upload.json(recipe).group(group.id)
    .addMetadata({
      name: recipeName,
      keyValues: {
        author: author, 
        recipes: "true"
      }
    })
    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}