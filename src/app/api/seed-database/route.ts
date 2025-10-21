import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseAppsData } from '@/lib/dataParser'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    // Read the apps data file
    const filePath = join(process.cwd(), 'someOfmyapps.txt')
    const appsText = readFileSync(filePath, 'utf-8')

    // Parse the data
    const appsData = parseAppsData(appsText)

    if (appsData.length === 0) {
      return NextResponse.json(
        { error: 'No valid apps found to insert' },
        { status: 400 }
      )
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('apps')
      .insert(appsData)
      .select()

    if (error) {
      console.error('Error inserting apps data:', error)
      return NextResponse.json(
        { error: 'Failed to insert apps data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully seeded ${data?.length || 0} apps into the database`,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
