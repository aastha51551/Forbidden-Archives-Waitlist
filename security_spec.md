# Security Specification: Forbidden Archives Waitlist

## 1. Data Invariants
- Each waitlist entry is uniquely identified by its custom `id` (e.g. `FA-XXXXXX`).
- Anyone can create an entry to sign up for the waitlist.
- Anyone can retrieve a specific waitlist token if they provide the exact, unique token ID (`get` access).
- Blanket scraping/listing of waitlist entries is strictly forbidden to prevent PII exposure (email addresses).
- Members can update their own waitlist entry under very specific conditions (specifically, update their `shares` Map when they share the portal link).

## 2. Security Rules Setup
We will write rules with the following assertions:
- **Default Deny**: All read/write operations of unspecified collections are disallowed.
- **Get Collection**: `allow get` is enabled for any valid token ID, but `allow list` is disabled (or only allowed for designated admins if needed).
- **Create Entry**: `allow create` is permitted if the incoming schema is structurally valid, the creation timestamp is accurate, and the entry starts unverified.
- **Update Entry**: `allow update` is permitted ONLY if:
  - The modification corresponds to the verified transition action (verifying the token).
  - Or the modification corresponds to recording share status (updating `shares` Map).
  - All other fields are immutable.
