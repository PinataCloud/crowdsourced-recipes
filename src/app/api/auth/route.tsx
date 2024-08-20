import pinata from "@/app/pinata"
import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET(request: Request) {
  try {
    //  Get the request's authorization token and verify it. 
    //  If the token is valid, then proceed.
    const key = await pinata.keys.create({
      keyName: Date.now().toString(),
      maxUses: 1,
      permissions: {
        admin: false,
        endpoints: {
          data: {
            pinList: true,
            userPinnedDataTotal: false
          },
          pinning: {
            hashMetadata: true,
            hashPinPolicy: false,
            pinByHash: true,
            pinFileToIPFS: true,
            pinJSONToIPFS: true,
            pinJobs: false,
            unpin: false,
            userPinPolicy: false
          }
        }
      }
    });
    return NextResponse.json({ data: key.JWT }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}