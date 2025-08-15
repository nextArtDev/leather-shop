// import LocationSelectorForm from '@/components/shared/province-city/LocationSelectorForm'
// import { getProvinces } from '@/lib/home/actions/location'

const page = async () => {
  //خوزستان ->18
  // const provinces = await getProvinces()
  //   console.log(provinces)
  return (
    <section
      className="w-full h-full min-h-screen flex flex-col items-center
     justify-center max-w-md mx-auto"
    >
      page
      {/* {provinces.length > 0 && <LocationSelectorForm provinces={provinces} />} */}
    </section>
  )
}

export default page
