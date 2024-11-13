import { Button } from "@/components/ui/button";
import { useState } from 'preact/hooks';
import SvgCheck from "./icons/Check";
import SvgCopy from "./icons/Copy";

const CopyToClipboard = ({ code }: { code: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div className="flex items-center">
        <pre className="p-4 text-sm font-mono bg-muted text-foreground overflow-x-auto flex-grow">
          {code}
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="m-2 flex-shrink-0"
          onClick={copyToClipboard}
          aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {isCopied ? <SvgCheck className="h-4 w-4" /> : <SvgCopy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default CopyToClipboard;
