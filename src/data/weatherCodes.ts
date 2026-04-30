export function weatherCodeKey(code: number | null | undefined): string {
  if (code === null || code === undefined) return 'wcode.unknown'
  const allowed = [0,1,2,3,45,48,51,53,55,61,63,65,71,73,75,80,81,82,85,86,95,96,99]
  if (allowed.includes(code)) return 'wcode.' + code
  return 'wcode.unknown'
}
