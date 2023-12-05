@genType
type key =
  | @as("preferred_language") PreferredLanguage
  | @as("preferred_timezone") PreferredTimeZone

@genType
module Key = {
  let \"PreferredLanguage" = PreferredLanguage
  let \"PreferredTimeZone" = PreferredTimeZone
}
