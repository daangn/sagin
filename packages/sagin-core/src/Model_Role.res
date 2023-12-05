@genType
type t =
  | @as("user") User
  | @as("admin") Admin
  | @as("sys_admin") SystemAdmin

@genType
let \"User" = User

@genType
let \"Admin" = Admin

@genType
let \"SystemAdmin" = SystemAdmin

@genType
let check = (~requiredRole, ~userRole) => {
  switch (requiredRole, userRole) {
  | (User, _)
  | (Admin, Admin | SystemAdmin)
  | (SystemAdmin, SystemAdmin) => true
  | _ => false
  }
}
