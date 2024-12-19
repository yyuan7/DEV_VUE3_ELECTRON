interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  totalPages: number
  layout: string
}
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [5, 10, 20, 50],
  pageSize: 10,
  totalPages: 5,
  layout: 'total, sizes, prev, pager, next, jumper'
}

const suggestPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [5, 10, 20, 50],
  pageSize: 5,
  totalPages: 1,
  layout: 'total, sizes, prev, pager, next, jumper'
}

export { defaultPaginationData, suggestPaginationData }
