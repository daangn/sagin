@genType @tag("kind")
type membership =
  | @as("pending") Pending({requestedAt: Js.Date.t})
  | @as("declined") Decliend({decliendAt: Js.Date.t})
  | @as("active") Active({activatedAt: Js.Date.t})
  | @as("inactive") Inactive({deactivatedAt: Js.Date.t})

@genType
type membershipStatus =
  | @as("pending") Pending
  | @as("declined") Decliend
  | @as("active") Active
  | @as("inactive") Inactive

@genType
module MembershipStatus = {
  let \"Pending" = Pending
  let \"Declined" = Decliend
  let \"Active" = Active
  let \"Inactive" = Inactive
}
