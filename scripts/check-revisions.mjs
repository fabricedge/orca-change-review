import { revisions } from '../lib/revisions.mjs'
import { validateRevisions } from '../lib/validate-revisions.mjs'

validateRevisions(revisions)
console.log(`${revisions.length} revisões válidas`)
