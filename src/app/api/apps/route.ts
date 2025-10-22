import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import appsData from '@/data/someOfMyApps'
import { mergeAppAssets } from '@/lib/assets'

export async function GET() {
  try {
    // Prioritize local data for development - comment out Supabase for now
    console.log('Using local app data (development mode)')

    // Transform local data to match App type by adding missing properties
    const transformedAppsData = appsData.map((app, index) => ({
      ...app,
      id: `local-${index + 1}`, // Generate deterministic IDs for local data
      created_at: new Date('2024-01-01T00:00:00Z').toISOString(), // Fixed date for SSR compatibility
      last_updated: new Date('2024-01-15T10:30:00Z').toISOString(), // Fixed date for SSR compatibility
      status: app.status as 'Live' | 'Finalizing' | 'In Development', // Type assertion for status
      traffic: 0,
      featured: false
    }))

    return NextResponse.json(mergeAppAssets(transformedAppsData))

    // Uncomment below if you want to use Supabase in production:
    /*
    // Try to fetch from Supabase first
    const { data: supabaseApps, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      // Fallback to local data if Supabase fails
      console.log('Falling back to local app data')
      // Transform local data to match App type by adding missing properties
      const transformedAppsData = appsData.map((app, index) => ({
        ...app,
        id: `local-${index + 1}`, // Generate deterministic IDs for local data
        created_at: new Date('2024-01-01T00:00:00Z').toISOString(), // Fixed date for SSR compatibility
        last_updated: new Date('2024-01-15T10:30:00Z').toISOString(), // Fixed date for SSR compatibility
        status: app.status as 'Live' | 'Finalizing' | 'In Development', // Type assertion for status
        traffic: 0,
        featured: false
      }))
      return NextResponse.json(mergeAppAssets(transformedAppsData))
    }

    if (supabaseApps && supabaseApps.length > 0) {
      // Transform Supabase data to match App type
      const transformedApps = supabaseApps.map(app => ({
        id: app.id,
        name: app.name,
        description: app.description,
        category: app.category,
        status: app.status,
        live_url: app.live_url,
        github_url: app.github_url,
        tags: app.tags || [],
        created_at: app.created_at,
        last_updated: app.updated_at, // Map Supabase's updated_at to last_updated
        // Add default values for missing fields
        traffic: 0,
        featured: false
      }))

      // Merge with visual assets
      return NextResponse.json(mergeAppAssets(transformedApps))
    }

    // If no apps in Supabase, use local data
    // Transform local data to match App type by adding missing properties
    const transformedAppsData = appsData.map((app, index) => ({
      ...app,
      id: `local-${index + 1}`, // Generate deterministic IDs for local data
      created_at: new Date('2024-01-01T00:00:00Z').toISOString(), // Fixed date for SSR compatibility
      last_updated: new Date('2024-01-15T10:30:00Z').toISOString(), // Fixed date for SSR compatibility
      status: app.status as 'Live' | 'Finalizing' | 'In Development', // Type assertion for status
      traffic: 0,
      featured: false
    }))
    return NextResponse.json(mergeAppAssets(transformedAppsData))
    */

  } catch (error) {
    console.error('Error fetching apps:', error)
    // Fallback to local data
    // Transform local data to match App type by adding missing properties
    const transformedAppsData = appsData.map((app, index) => ({
      ...app,
      id: `local-${index + 1}`, // Generate deterministic IDs for local data
      created_at: new Date('2024-01-01T00:00:00Z').toISOString(), // Fixed date for SSR compatibility
      last_updated: new Date('2024-01-15T10:30:00Z').toISOString(), // Fixed date for SSR compatibility
      status: app.status as 'Live' | 'Finalizing' | 'In Development', // Type assertion for status
      traffic: 0,
      featured: false
    }))
    return NextResponse.json(mergeAppAssets(transformedAppsData))
  }
}

export async function POST(request: Request) {
  try {
    const appData = await request.json()

    // Validate required fields
    if (!appData.name || !appData.description || !appData.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('apps')
      .insert([{
        ...appData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to create app' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating app:', error)
    return NextResponse.json({ error: 'Failed to create app' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('apps')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update app' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating app:', error)
    return NextResponse.json({ error: 'Failed to update app' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete app' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting app:', error)
    return NextResponse.json({ error: 'Failed to delete app' }, { status: 500 })
  }
}
