"use client";

import { useEffect, useState } from "react";
import { useTemplate, useGenerateTemplate } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Copy, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { useParams } from "next/navigation";

export default function TemplateDetailPage() {
  const params = useParams();
  const decodedPath = decodeURIComponent(params.path as string);
  const { data: template, isLoading, error } = useTemplate(decodedPath);
  const generateTemplateMutation = useGenerateTemplate();

  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Extract variables from template content when it loads
  useEffect(() => {
    if (template?.content) {
      // Simple regex to find variables like {{variable_name}}
      const variableMatches = template.content.match(/\{\{([^}]+)\}\}/g) || [];
      const uniqueVariables: Record<string, string> = {};

      variableMatches.forEach(match => {
        const varName = match.replace(/\{\{|\}\}/g, '').trim();
        uniqueVariables[varName] = '';
      });

      setVariables(uniqueVariables);
    }
  }, [template?.content]);

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateTemplate = async () => {
    try {
      const content = await generateTemplateMutation.mutateAsync({
        raw_markdown: template?.content || "",
      });

      setGeneratedContent(content);
      toast.success("Template generated successfully");
    } catch (error) {
      toast.error("Failed to generate template");
      console.error("Error generating template:", error);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Copied to clipboard");
    }
  };

  const downloadTemplate = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template?.name || 'template'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="py-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d97757]"></div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Template not found</h1>
            <p className="mb-6">The template you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.</p>
            <Link href="/templates">
              <Button>Back to Templates</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Link href="/templates">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Templates
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-[#d97757]" />
                      <h1 className="text-2xl font-bold">{template.name}</h1>
                    </div>

                    {template.description && (
                      <p className="text-gray-600 mb-6">{template.description}</p>
                    )}

                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h2 className="font-medium mb-2">Template Preview</h2>
                      <div className="prose max-w-none bg-white p-4 rounded border border-gray-200 overflow-auto max-h-[400px]">
                        <pre className="whitespace-pre-wrap text-sm">
                          {template.content}
                        </pre>
                      </div>
                    </div>

                    {generatedContent && (
                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="font-medium">Generated Template</h2>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyToClipboard}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadTemplate}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="prose max-w-none bg-white p-4 rounded border border-gray-200 overflow-auto max-h-[400px]">
                          <pre className="whitespace-pre-wrap text-sm">
                            {generatedContent}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Template Variables</h2>

                    {Object.keys(variables).length > 0 ? (
                      <div className="space-y-4">
                        {Object.keys(variables).map(varName => (
                          <div key={varName} className="space-y-1">
                            <label className="text-sm font-medium">
                              {varName}
                            </label>
                            <input
                              type="text"
                              value={variables[varName]}
                              onChange={(e) => handleVariableChange(varName, e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder={`Enter ${varName}`}
                            />
                          </div>
                        ))}

                        <Button
                          onClick={handleGenerateTemplate}
                          className="w-full bg-[#d97757] hover:bg-[#c86a4a] text-white mt-4"
                          disabled={generateTemplateMutation.isPending}
                        >
                          {generateTemplateMutation.isPending ? "Generating..." : "Generate Template"}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500">This template has no variables to customize.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 