/**
  Data protection policy

  Protected:
    Data must be protected, so it will never be shared with external APIs

  Relaxed:
    Data might be shared for its purpose, like to request text embeddings to external AI models.
*/
@genType
type policy =
  | @as("protected") Protected
  | @as("relaxed") Relaxed
