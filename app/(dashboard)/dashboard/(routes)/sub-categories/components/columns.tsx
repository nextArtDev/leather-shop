'use client'

import NextImage from 'next/image'
import { BadgeCheck, BadgeMinus } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { CellActions } from './cell-actions'
import { Category, Image, SubCategory } from '@/lib/generated/prisma'

export const columns: ColumnDef<
  SubCategory & { category: Category } & { images: Image[] }
>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return (
        <div className="relative w-20  aspect-square min-w-20 rounded-2xl overflow-hidden">
          <NextImage
            src={row.original?.images[0]?.url}
            alt={row.original.name}
            fill
            className="  rounded-2xl object-cover shadow-2xl"
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      )
    },
  },

  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return <span> {row.original.category.name}</span>
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      return <span>/{row.original.url}</span>
    },
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original

      return <CellActions rowData={rowData} />
    },
  },
]

// Define props interface for CellActions component
