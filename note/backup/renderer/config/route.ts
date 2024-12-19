/** Default role - assign when fail to get user info */

// Version 1
interface Route {
  defaultRoles: Array<string>
}

const routeSetting: Route = {
  defaultRoles: ['DEFAULT']
}

// // Version 2
// interface Route {
//   dynamic: boolean
//   defaultRoles: Array<string>
//   thirdLevelRouteCache: boolean
// }

// const routeSetting: Route = {
//   dynamic: true,
//   defaultRoles: ['DEFAULT'],
//   thirdLevelRouteCache: true,
// }

export default routeSetting
