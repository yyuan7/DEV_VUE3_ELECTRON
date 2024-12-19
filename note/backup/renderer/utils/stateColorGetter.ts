export function stateButtonColor(state: string): string | undefined {
  switch (state) {
    case 'Maine':
      return 'rgb(86 140 84)'
    case 'Connecticut':
      return 'rgb(129 76 175)'
    case 'New York':
      return 'rgb(33 100 157)'
    default:
      return 'rgb(230 230 230)'
  }
}

export function secondaryButtonColor(state: string): string | undefined {
  switch (state) {
    case 'Maine':
      return '#69e36e'
    case 'Connecticut':
      return '#b069e3'
    case 'New York':
      return '#478bc6'
    default:
      return undefined
  }
}

export function backgroundColor(state: string): string | undefined {
  switch (state) {
    case 'Maine':
      return 'rgba(175, 240, 150, 0.216)'
    case 'Connecticut':
      return 'rgba(206, 150, 240, 0.216)'
    case 'New York':
      return 'rgba(104, 123, 239, 0.216)'
    default:
      return undefined
  }
}

export function stateCardColor(state: string): string | undefined {
  switch (state) {
    case 'Maine':
      return '#bbdbb2'
    case 'Connecticut':
      return '#c7b2db'
    case 'New York':
      return '#a4a9e2'
    default:
      return undefined
  }
}

export function tableHeaderColor(state: string): string | undefined {
  switch (state) {
    case 'Maine':
      return 'rgb(101 111 102)'
    case 'Connecticut':
      return 'rgb(107 101 111)'
    case 'New York':
      return 'rgb(101 102 111)'
    default:
      return 'rgb(112 112 112)'
  }
}
