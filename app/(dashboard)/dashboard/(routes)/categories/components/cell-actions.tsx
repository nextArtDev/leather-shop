import { useModal } from '@/providers/modal-provider'

import { Edit, MoreHorizontal, Trash } from 'lucide-react'
// UI components
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

import { useActionState } from 'react'
// import { deleteCategory } from '@/lib/actions/dashboard/categories'
// import { getCategoryById } from '@/lib/queries/dashboard/category'
import { usePathname } from 'next/navigation'
import CustomModal from '../../../components/custom-modal'
import CategoryDetails from './category-details'
import { Category, Image } from '@/lib/generated/prisma'
// import { toast } from 'sonner'
import Link from 'next/link'
import { getCategoryById } from '../../../lib/queries'
import { deleteCategory } from '../../../lib/actions/category'

interface CellActionsProps {
  rowData: Category & { images: Image[] }
}

// CellActions component definition
export const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal()
  const path = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteAction, pending] = useActionState(
    deleteCategory.bind(null, path, rowData.id as string),
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
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link
            className="flex items-center gap-2"
            href={`/dashboard/categories/${rowData.id}`}
          >
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                try {
                  setOpen(
                    <CustomModal>
                      <CategoryDetails initialData={rowData} />
                    </CustomModal>,
                    async () => {
                      const data = await getCategoryById(rowData.id)
                      return {
                        rowData: data,
                      }
                    }
                  )
                } catch (error) {
                  console.error('Error:', error)
                }
              }}
            >
              <Edit size={15} />
              ویرایش دسته‌بندی
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> حذف دسته‌بندی
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف دسته‌بندی مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام دسته‌بندی و محصولاتش حذف خواهند
            شد!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">صرف نظر</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={() => {
              setClose()
              // toast('دسته‌بندی حذف شد!')
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
                حدف
              </Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
