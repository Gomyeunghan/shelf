import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const RootPage = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/home')
  else redirect('/login')
}

export default RootPage
