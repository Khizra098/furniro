export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-21'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skKcyYjR7sUlhTkLc9gMFWs4qFEoRKVVJbqlZwJ0pLd1v1XWsGc7mczh3UtWf3CObyKddpQ0Ih2XKWBE4onHX2QCTZ3uHfish6nuo8csgpomiLmHeQTjZJQnz61XouLvGnk1v5BJkYFNUV1XBYvu42ppSLAMuGcIY0xQr7toJ8IoHMm9yCLt",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
