import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseAppsData } from '@/lib/dataParser'

// Import supabase client dynamically to avoid build-time issues
async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function POST(request: NextRequest) {
  try {
    // Get Supabase client at runtime
    const supabase = await getSupabaseClient()

    // Read the apps data file
    const filePath = join(process.cwd(), 'public', 'someOfmyapps.txt')
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
