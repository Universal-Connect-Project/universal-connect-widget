/**
Tagged template function to pave over some of the unfortunate design decisions
in Rx's marble testing system.

This is not ready for wide use because it has yet unknown memory requirements.
**/
function frames(unit, strings) {
  return Array.prototype.map
    .call(strings.join(''), x =>
      ['!', '#', '|', '^', '(', ')'].includes(x) ? x : x.concat('-'.repeat(unit - 1)),
    )
    .join('')
}

export const ms = frames.bind(null, 1)
export const sec = frames.bind(null, 1000)
export const min = frames.bind(null, 1000000)
