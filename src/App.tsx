import { useRef, useState } from 'react'
import init, { render_pdf } from 'typst-web'
import fontUrl from './assets/font/AtkinsonHyperlegible-Regular.ttf'

function App() {
  const [pdfLoading, setPdfLoading] = useState(false)
  const wasmInitialized = useRef(false)

  const handleGeneratePdf = async () => {
    setPdfLoading(true)
    try {
      if (!wasmInitialized.current) {
        const { init_logging } = await init()
        init_logging()
        wasmInitialized.current = true
      }

      const fontResponse = await fetch(fontUrl)
      const fontBuffer = await fontResponse.arrayBuffer()
      const fontBytes = Array.from(new Uint8Array(fontBuffer))

      const template = `
#set page(paper: "a4")
#set text(font: "Atkinson Hyperlegible")

= Hello World

This PDF was generated using Typst in the browser.
`

      const pdfBytes = render_pdf({ template, fonts: [fontBytes] }, { embed: '', items: [] })
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url)
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleGeneratePdf} disabled={pdfLoading}>
        test
      </button>
    </div>
  )
}

export default App
