import { BillingRule, RegionList, UPC } from '@/renderer/api/billing/type'

export function getRules(upc: UPC, allRules: BillingRule[], state: string, regions: string[]) {
  // database access takes place here -> replace filters with query
  const now = new Date()
  const relevant = allRules.filter((rule) => {
    return (
      rule.state === state &&
      rule.upc === upc.code &&
      now > rule.startDate &&
      (!rule.endDate || now < rule.endDate) &&
      regions.includes(rule.region)
    )
  })
  return relevant
}

// gets fraction of regions covered by active billing rules e.g. "10/13" (3 regions have no active rules)
export function getRuleCount(
  regionsByState: RegionList[], // entire db table of [{state: maine, regions: ['','']}, etc.]
  state: string, // active state
  upc: UPC, // upc whose rules are being counted
  rules: BillingRule[] // entire db of billing rules
) {
  const listByState = regionsByState.find((item: RegionList) => item.state === state)
  var regionlist: string[] = []
  if (listByState) regionlist = listByState.regions

  const relevantRules = getRules(upc, rules, state, regionlist) // database access moment!

  return relevantRules.length + '/' + regionlist?.length
}
