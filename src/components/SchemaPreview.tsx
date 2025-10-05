import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SchemaPreviewProps {
  schema: any;
}

const SchemaPreview = ({ schema }: SchemaPreviewProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(schema, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast({
        title: "Success!",
        description: "Schema copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadSchema = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Schema downloaded successfully",
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Schema</CardTitle>
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} size="sm" variant="outline">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={downloadSchema} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[70vh] overflow-auto rounded-lg">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            {jsonString}
          </SyntaxHighlighter>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Copy or download the generated JSON-LD schema</li>
            <li>Add it to your website's &lt;head&gt; section</li>
            <li>Wrap it in &lt;script type="application/ld+json"&gt; tags</li>
            <li>Test with Google's Rich Results Test</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemaPreview;
