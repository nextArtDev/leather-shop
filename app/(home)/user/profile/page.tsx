import { getCurrentUser } from '@/lib/auth-helpers'
import { Metadata } from 'next'
import ProfileForm from './components/profile-form'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'پروفایل',
}

const Profile = async () => {
  const session = await getCurrentUser()
  if (!session?.name || !session.phoneNumber) redirect('/sign-in')
  const initialData = {
    name: session.name,
    phoneNumber: session.phoneNumber,
  }
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="font-bold text-xl">پروفایل</h2>
      <ProfileForm initialData={initialData} />
    </div>
  )
}

export default Profile
