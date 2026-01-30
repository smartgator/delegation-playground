'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CaveatCodeProps {
  code: string
  language?: string
}

function highlightCode(code: string): React.ReactNode[] {
  const keywords = ['import', 'from', 'const', 'type', 'function', 'return', 'export', 'default', 'as', 'new']
  const types = ['string', 'number', 'boolean', 'bigint', 'null', 'undefined']
  
  const lines = code.split('\n')
  
  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = []
    let currentIndex = 0
    
    const stringRegex = /'[^']*'|"[^"]*"|`[^`]*`/g
    const numberRegex = /\b(\d+(_\d+)*n?|\d+\.?\d*)\b/g
    const commentRegex = /\/\/.*$/g
    
    const matches: { start: number; end: number; type: string; value: string }[] = []
    
    let match
    while ((match = stringRegex.exec(line)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, type: 'string', value: match[0] })
    }
    
    while ((match = numberRegex.exec(line)) !== null) {
      const isInsideString = matches.some(m => m.type === 'string' && match!.index >= m.start && match!.index < m.end)
      if (!isInsideString) {
        matches.push({ start: match.index, end: match.index + match[0].length, type: 'number', value: match[0] })
      }
    }
    
    while ((match = commentRegex.exec(line)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, type: 'comment', value: match[0] })
    }
    
    matches.sort((a, b) => a.start - b.start)
    
    const processedRanges = new Set<string>()
    
    for (const m of matches) {
      const rangeKey = `${m.start}-${m.end}`
      if (processedRanges.has(rangeKey)) continue
      
      if (m.start > currentIndex) {
        const text = line.slice(currentIndex, m.start)
        tokens.push(...highlightKeywords(text, keywords, types, lineIndex, currentIndex))
      }
      
      const colorClass = {
        string: 'text-cyan-400',
        number: 'text-amber-400',
        comment: 'text-muted-foreground/60 italic',
      }[m.type] || ''
      
      tokens.push(
        <span key={`${lineIndex}-${m.start}`} className={colorClass}>
          {m.value}
        </span>
      )
      
      currentIndex = m.end
      processedRanges.add(rangeKey)
    }
    
    if (currentIndex < line.length) {
      const remaining = line.slice(currentIndex)
      tokens.push(...highlightKeywords(remaining, keywords, types, lineIndex, currentIndex))
    }
    
    return (
      <div key={lineIndex} className="leading-relaxed">
        {tokens.length > 0 ? tokens : '\u00A0'}
      </div>
    )
  })
}

function highlightKeywords(
  text: string, 
  keywords: string[], 
  types: string[], 
  lineIndex: number, 
  startOffset: number
): React.ReactNode[] {
  const result: React.ReactNode[] = []
  const wordRegex = /\b\w+\b/g
  let lastIndex = 0
  let match
  
  while ((match = wordRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(
        <span key={`${lineIndex}-${startOffset}-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      )
    }
    
    const word = match[0]
    let className = ''
    
    if (keywords.includes(word)) {
      className = 'text-violet-400 font-medium'
    } else if (types.includes(word)) {
      className = 'text-emerald-400'
    } else if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
      className = 'text-yellow-300'
    }
    
    result.push(
      <span key={`${lineIndex}-${startOffset}-${match.index}`} className={className}>
        {word}
      </span>
    )
    
    lastIndex = match.index + word.length
  }
  
  if (lastIndex < text.length) {
    result.push(
      <span key={`${lineIndex}-${startOffset}-${lastIndex}-end`}>
        {text.slice(lastIndex)}
      </span>
    )
  }
  
  return result
}

export function CaveatCode({ code, language = 'TypeScript' }: CaveatCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/50 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border/30">
        <span className="text-xs font-medium text-muted-foreground/70">{language}</span>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors',
            'hover:bg-white/10',
            copied ? 'text-emerald-400' : 'text-muted-foreground/70'
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-gray-300">
          <code>{highlightCode(code)}</code>
        </pre>
      </div>
    </div>
  )
}
