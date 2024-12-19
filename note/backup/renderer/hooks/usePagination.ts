import { reactive } from 'vue'

interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [5, 10, 20, 50],
  pageSize: 5,
  layout: 'total, sizes, prev, pager, next, jumper'
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  // merge pagination config
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })

  // handle change on page number
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
    console.log('jump to page ' + paginationData.currentPage)
  }

  // handle change on items loaded on a page
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
