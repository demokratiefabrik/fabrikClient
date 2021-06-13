const silbentrennung = (word, endOfLine) => {
  word = word.trim()
  const isSeperatedWord = word.slice(-2) == "||"
  if (!isSeperatedWord && !endOfLine && word) {
    return word + ' '
  }

  if (isSeperatedWord) {
    return word.replace("||", endOfLine ? "-" : "");
  }

  return (word)
}

export const linebreaker = (label, maxlen = 20, maxlines = 0) => {
  // const maxlen = 20
  if (label.length <= maxlen) {
    return (label)
  }
  const orgwords = label.split(" ")

  // SILBENTRENNUNG
  var words = []
  orgwords.forEach(word => {
    while (word && word.length > maxlen) {
      words.push(word.substr(0, maxlen) + "||");
      word = word.substr(maxlen);
    }
    if (word.length > 0) {
      words.push(word)
    }
  })

  const startlines = []
  const endlines = []
  var start = ''
  var end = ''
  var first = ''
  while (words.length > 0) {

    let first = words.shift()

    if ((first + start).length > maxlen) {
      // too large for both.. dump the string in the "start" variable
      startlines.push(silbentrennung(start, true))
      start = ''
    }
    start = silbentrennung(start, false) + first

    // add last word to end string
    if (words.length > 0) {
      let last = words.pop()
      if ((last + end).length > maxlen) {
        // too large for both.. dump the string in the "end" variable
        endlines.unshift(silbentrennung(end, true))
        end = ''
      }
      end = silbentrennung(last, false) + end
    }

    // if start or end string are overlength, put them into startlines resp. endlines lists
    if (start.length > maxlen) {
      startlines.push(silbentrennung(start, true))
      start = ''
    }
    if (end.length > maxlen) {
      endlines.unshift(silbentrennung(end, true))
      end = ''
    }
  }

  // assign the rest either to the startlines list (or both)
  if ((start + end).length > maxlen) {
    startlines.push(silbentrennung(start, true))
    endlines.unshift(silbentrennung(end, true))
  } else {
    startlines.push(silbentrennung(start, false) + silbentrennung(end, true))
  }
  let final = startlines.concat(endlines)
  final = final.filter(empty => empty.length > 0)
  if (maxlines && final.length > maxlines) {
    final[maxlines - 1] += "..."
    return (final.slice(0, maxlines))
  }

  return (final)
}