import { Note } from '@/renderer/api/common/type'
import { BetterBillingRule, BillingRule, RuleDisplay } from '../api/billing/type'
import { getUpcInfo } from '../api/upc'
import { getBillingRuleList } from '../api/billing'
import { defaultPaginationData } from '../constants/pagination'
// import {reqUserName} from '@/renderer/api/login'

export function getNotesAsString(notes: Note[]) {
  if (!notes || !Array.isArray(notes)) return ''

  let message = ''
  for (let i = notes.length - 1; i >= 0; i--) {
    message = message + notes[i].message + '\n - ' + notes[i].username + ', ' + notes[i].date
    if (i > 0) {
      message = message + '\n \n'
    }
  }
  return message
}

export function checkPhoneValidity(number: string): string | boolean {
  if (number) {
    if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(number)) {
      return 'Invalid phone number'
    } else {
      return true
    }
  }
  return 'Invalid phone number' // Return invalid message if the number is empty
}

export function formatDate(date: Date | null) {
  if (date)
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  return ''
}

const addRuleToGroup = (
  rule: BetterBillingRule,
  groupIndex: number,
  condensedRules: RuleDisplay[]
) => {
  const group = condensedRules[groupIndex]
  group.regions.push(rule.region)
  group.ids.push(rule.id)
  group.rules.push(rule)
}

export function reformatRules(simpleRules: BetterBillingRule[], condensedRules: RuleDisplay[]) {
  let counter = 1
  for (const rule of simpleRules) {
    const groupIndex = condensedRules.findIndex((item: RuleDisplay) => {
      const pattern = item.rules[0]
      const starttime = pattern.startDate === rule.startDate
      const endtime = !pattern.endDate || !rule.endDate || rule.endDate === pattern.endDate
      const fitsPattern =
        item.upc.upcCode === rule.upc.upcCode &&
        pattern.state === rule.state &&
        pattern.distributor === rule.distributor &&
        pattern.initiator === rule.initiator &&
        pattern.pickupAgent === rule.pickupAgent &&
        starttime &&
        endtime
      return fitsPattern
    })

    if (groupIndex !== -1) {
      addRuleToGroup(rule, groupIndex, condensedRules)
    } else {
      condensedRules.push({
        ids: [rule.id],
        upc: rule.upc,
        regions: [rule.region],
        rules: [rule],
        ruleID: counter
      })
    }
    if (groupIndex === -1) {
      counter++
    }
  }
}

export function convertDisplayToRule(displays: RuleDisplay[]) {
  const output: BillingRule[] = []
  displays.forEach((display: RuleDisplay) => {
    display.rules.forEach((rule) => {
      if (rule.upc.upcCode) rule.upcCode = rule.upc.upcCode
      output.push(rule)
    })
  })
  return output
}

export function titleCapitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}
