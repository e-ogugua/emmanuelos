import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import seedData from '@/data/someOfMyApps'

export async function POST() {
  try {
    // Transform seed data to match Supabase schema
    const transformedData = seedData.map((app, index) => ({
      id: `app-${Date.now()}-${index}`, // Generate unique ID for each app
      name: app.name,
      description: app.description,
      category: app.category,
      status: app.status,
      live_url: app.live_url,
      github_url: app.github_url,
      tags: app.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase.from('apps').upsert(transformedData)
    if (error) throw error

    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
