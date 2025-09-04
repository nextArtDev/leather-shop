import { Metadata } from 'next'
import ProfileForm from './components/profile-form'
import { notFound } from 'next/navigation'
import SignOutBtn from '@/components/home/shared/SignOutBtn'
import { getCurrentUserWithFetch } from '@/lib/auth-helpers'

export const metadata: Metadata = {
  title: 'پروفایل',
}

export const dynamic = 'force-dynamic'
const Profile = async () => {
  const session = await getCurrentUserWithFetch()
  if (!session?.name || !session.phoneNumber) notFound()
  const initialData = {
    name: session.name,
    phoneNumber: session.phoneNumber,
  }
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-bold text-xl">پروفایل</h2>

        <SignOutBtn variant={'destructive'} className="" />
      </div>
      <ProfileForm initialData={initialData} />
    </div>
  )
}

export default Profile
