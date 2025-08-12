import { notFound } from 'next/navigation'
import VariantDetails from '../components/variant-details'

export default async function SellerNewProductVariantPage({
  params,
}: {
  //   params: { storeUrl: string; productId: string }
  params: Promise<{ productId: string }>
}) {
  const productId = (await params).productId

  // Fetching products data from the database for the active store
  // const product = await getProductById(productId)
  if (!productId) return notFound()
  // if (!product) return null

  return (
    <div>
      <VariantDetails productId={productId} />
    </div>
  )
}
