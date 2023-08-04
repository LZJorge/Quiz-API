export function normalizeString(string: string) {
    const result = string.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .trim()

    return result
}