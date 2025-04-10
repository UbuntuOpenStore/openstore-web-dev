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
    <div class="relative rounded-lg overflow-hidden border border-border">
      <div class="flex items-center">
        <pre class="p-4 text-sm font-mono bg-muted text-foreground overflow-x-auto grow">
          {code}
        </pre>
        <Button
          variant="ghost"
          size="icon"
          class="m-2 shrink-0"
          onClick={copyToClipboard}
          aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {isCopied ? <SvgCheck class="h-4 w-4" /> : <SvgCopy class="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default CopyToClipboard;
