import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Colors = [
  { id: '1', color: '#4c5824' },
  { id: '2', color: '#124500' },
  { id: '3', color: '#333' },
]
const Sizes = [
  { id: '1', size: 'SMALL' },
  { id: '2', size: 'MEDIUM' },
  { id: '3', size: 'LARGE' },
]

const ProductDetails = () => {
  return (
    <section className="m-1 ">
      <article className="grid grid-row-4 gap-4">
        <p className="text-sm font-semibold">TITLE</p>
        <p className="text-base font-bold">
          medium handbag with double flap in grained leather
        </p>

        <Separator />

        <p className="text-sm font-semibold">COLORS</p>
        <div className="flex gap-1">
          {Colors.map((clr) => (
            <Button
              size={'icon'}
              key={clr.id}
              style={{ background: clr.color }}
              className={`rounded-none size-8 cursor-pointer`}
            />
          ))}
        </div>
        <Separator />

        <p className="text-sm font-semibold">Sizes</p>
        <div className="flex gap-1">
          {Sizes.map((size) => (
            <Button
              className="rounded-sm  cursor-pointer"
              variant={'outline'}
              key={size.id}
            >
              {size.size}
            </Button>
          ))}
        </div>
      </article>
    </section>
  )
}

export default ProductDetails
