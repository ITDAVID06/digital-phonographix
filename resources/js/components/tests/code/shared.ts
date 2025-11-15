// components/tests/code/shared.ts
export const COL1 = [
  "b","c","d","f","g","h","j","k","l","m","n","p","r","s","t","v","w",
] as const

export const COL2 = [
  "x","y","z","i","e","a","o","u","sh","ch","th","ck","qu","ce","ai","ou","ea",
] as const

export const COL3 = [
  "oa","ow","igh","eigh","ay","ie","aw","ee","ey","ue","ew","au","oo","ui","oy","oi",
] as const

export const STUDENT_ORDER: string[] = [...COL1, ...COL2, ...COL3]

export const META: Record<string, string> = {
  b: "boy",
  c: "cat / city",
  d: "dog",
  f: "fat",
  g: "got / gentle",
  h: "hop",
  j: "job",
  k: "kid",
  l: "lap",
  m: "mop",
  n: "nod",
  p: "pat",
  r: "rat",
  s: "sat",
  t: "top",
  v: "give",
  w: "with",
  x: "fox 'ks' / exit 'gz'",
  y: "yes / happy / fly",
  z: "zipper",
  i: "rip",
  e: "net",
  a: "mat",
  o: "mop",
  u: "nut",
  sh: "ship",
  ch: "chip",
  th: "this / Thursday",
  ck: "duck",
  qu: "quick 'kw'",
  ce: "nice",
  ai: "rain",
  ou: "out / group / touch",
  ea: "each / steak / bread",
  oa: "boat",
  ow: "now / straw",
  igh: "right",
  eigh: "eight / height",
  ay: "play",
  ie: "die / chief",
  aw: "saw",
  ee: "seen",
  ey: "key / they",
  ue: "blue / clue",
  ew: "few / new",
  au: "August",
  oo: "wood / mood",
  ui: "suit",
  oy: "boy",
  oi: "soil",
}

export type CodeKnowledgeResult = {
  variant: "pretest" | "posttest"
  grapheme: string
  known: boolean
  examples: string
  timestamp: number
}

export const buildMap = (order: string[]) =>
  order.reduce((acc, g) => { acc[g] = false; return acc }, {} as Record<string, boolean>)
