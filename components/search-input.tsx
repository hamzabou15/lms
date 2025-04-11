"use client"
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'

const SearchInput = () => {


  const [value, setValue] = useState('');
  const debounceValue = useDebounce(value);

  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();


  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {

    const url = queryString.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debounceValue,
      }
    }, { skipEmptyString: true, skipNull: true }

    )
    router.push(url)
  }, [debounceValue, currentCategoryId, pathname, router])


  return (
    <div className='relative display flex items-center' >
      <Search
        className='h-4 w-4 absolute top-3 lef-3 ml-3 text-slate-600'
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100
              focus-visible:ring-slate-200
          '
        placeholder='Search for a course'
      />
    </div>
  )
}

export default SearchInput
