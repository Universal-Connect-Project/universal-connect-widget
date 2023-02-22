import { Subject } from 'rxjs'
import { share } from 'rxjs/operators'

export const WSEventSubject$ = new Subject().pipe(share())
