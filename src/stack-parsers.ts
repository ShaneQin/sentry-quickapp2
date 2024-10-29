import prompt from '@system.prompt'

import type {
  StackFrame,
  StackLineParser,
  StackLineParserFn
} from '@sentry/types'
import { UNKNOWN_FUNCTION, createStackParser } from '@sentry/utils'

const CHROME_PRIORITY = 30

function createFrame(
  filename: string,
  func: string,
  lineno?: number,
  colno?: number
): StackFrame {
  const frame: StackFrame = {
    filename,
    function: func === '<anonymous>' ? UNKNOWN_FUNCTION : func,
    in_app: true // All browser frames are considered in_app
  }

  if (lineno !== undefined) {
    frame.lineno = lineno
  }

  if (colno !== undefined) {
    frame.colno = colno
  }

  return frame
}

const chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i

const chromeRegex =
  /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i

const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/

const chromeStackParserFn: StackLineParserFn = line => {
  prompt.showToast({
    message: line
  })
  // If the stack line has no function name, we need to parse it differently
  const noFnParts = chromeRegexNoFnName.exec(line) as
    | null
    | [string, string, string, string]

  if (noFnParts) {
    const [, filename, line, col] = noFnParts
    return createFrame(filename, UNKNOWN_FUNCTION, +line, +col)
  }

  const parts = chromeRegex.exec(line) as
    | null
    | [string, string, string, string, string]

  if (parts) {
    const isEval = parts[2] && parts[2].indexOf('eval') === 0 // start of line

    if (isEval) {
      const subMatch = chromeEvalRegex.exec(parts[2]) as
        | null
        | [string, string, string, string]

      if (subMatch) {
        // throw out eval line/column and use top-most line/column number
        parts[2] = subMatch[1] // url
        parts[3] = subMatch[2] // line
        parts[4] = subMatch[3] // column
      }
    }

    return createFrame(
      parts[1] || UNKNOWN_FUNCTION,
      parts[2],
      parts[3] ? +parts[3] : undefined,
      parts[4] ? +parts[4] : undefined
    )
  }

  return
}

export const chromeStackLineParser: StackLineParser = [
  CHROME_PRIORITY,
  chromeStackParserFn
]

export const defaultStackLineParsers = [chromeStackLineParser]

export const defaultStackParser = createStackParser(...defaultStackLineParsers)
