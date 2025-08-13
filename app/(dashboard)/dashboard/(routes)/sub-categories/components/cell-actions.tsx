'use client'

import { useModal } from '@/providers/modal-provider'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Category, Image, SubCategory } from '@/lib/generated/prisma'

import { useActionState } from 'react'
import { usePathname } from 'next/navigation'
import CustomModal from '../../../components/custom-modal'
// import { toast } from 'sonner'
import SubCategoryDetails from './sub-category-details'
import { deleteSubCategory } from '../../../lib/actions/sub-category'

import Link from 'next/link'

interface CellActionsProps {
  rowData: SubCategory & { images: Image[] }
  categories: Partial<Category>[]
}

export const CellActions: React.FC<CellActionsProps> = ({
  rowData,
  categories,
}) => {
  const { setOpen, setClose } = useModal()
  const path = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteAction, pending] = useActionState(
    deleteSubCategory.bind(null, path, rowData.id as string),
    {
      errors: {},
    }
  )
  // Return null if rowData or rowData.id don't exist
  if (!rowData || !rowData.id) return null

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              try {
                setOpen(
                  <CustomModal>
                    <SubCategoryDetails
                      initialData={rowData}
                      categories={categories}
                    />
                  </CustomModal>
                  // async () => {
                  //   const data = await getSubCategoryById(rowData.id)
                  //   // console.log({ data })
                  //   return {
                  //     rowData: data,
                  //   }
                  // }
                )
              } catch (error) {
                console.error('Error:', error)
              }
            }}
          >
            <Link
              className="flex items-center gap-2"
              href={`/dashboard/sub-categories/${rowData.id}`}
            >
              <Edit size={15} />
              ویرایش زیردسته
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> حذف زیردسته‌بندی
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            از حذف دسته‌بندی مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            این عملیات برگشت‌پذیر نیست و تمام زیردسته‌بندی و محصولاتش حذف خواهند
            شد!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">صرف‌نظر</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={() => {
              setClose()
              // toast('Deleted sub category')
            }}
          >
            <form action={deleteAction}>
              <input className="hidden" />
              <Button
                disabled={pending}
                variant={'ghost'}
                type="submit"
                className="hover:bg-transparent active:bg-transparent w-full outline-none"
              >
                حذف
              </Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
