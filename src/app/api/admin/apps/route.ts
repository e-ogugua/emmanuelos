import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  try {
    // Check if user is admin (you would implement proper auth here)
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('admin')

    if (adminKey !== 'emmanuelos2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
    }

    return NextResponse.json(apps || [])
  } catch (error) {
    console.error('Error fetching admin apps:', error)
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
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
