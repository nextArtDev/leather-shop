import { getCurrentUser } from '@/lib/auth-helpers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'پروفایل',
}

const Profile = async () => {
  const session = await getCurrentUser()
  console.log({ session })
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      {/* <ProfileForm /> */}
    </div>
  )
}

export default Profile
