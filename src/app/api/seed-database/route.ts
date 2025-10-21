import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import seedData from '@/data/someOfMyApps'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    const { error } = await supabase.from('apps').upsert(seedData)
    if (error) throw error
    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
