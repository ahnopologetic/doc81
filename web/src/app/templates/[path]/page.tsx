"use client";

import { useEffect, useState } from "react";
import { useTemplate, useGenerateTemplate } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Copy, FileText, Tag, Building, Clipboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import MarkdownCollapsibleTimeline from "@/components/markdown-collapsible-timeline";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function TemplateDetailPage() {
  const params = useParams();
  const decodedPath = decodeURIComponent(params.path as string);
  const { data: template, isLoading, error } = useTemplate(decodedPath);
  const generateTemplateMutation = useGenerateTemplate();

  // const [variables, setVariables] = useState<Record<string, string>>({});
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

      // setVariables(uniqueVariables);
    }
  }, [template?.content]);

  // const handleVariableChange = (name: string, value: string) => {
  //   setVariables(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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

  // Sample AI prompts based on the template
  const getAIPrompts = () => {
    if (!template) return [];

    return [
      `doc81: Help me create a ${template.name} based on best practices (ref=${template.id})`,
      `doc81: Generate a detailed ${template.name} for my project about [YOUR_PROJECT] (ref=${template.id})`,
      `doc81: What should I include in my ${template.name} to ensure completeness? (ref=${template.id})`,
      `doc81: Write a ${template.name} that focuses on [SPECIFIC_ASPECT] (ref=${template.id})`,
      `doc81: Adapt this ${template.name} template for a [YOUR_INDUSTRY] context (ref=${template.id})`
    ];
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


                    <div className="mb-4">
                      {template.description && (
                        <Markdown remarkPlugins={[remarkGfm]}>{template.description}</Markdown>
                      )}
                    </div>

                    <MarkdownCollapsibleTimeline markdown={template.content} title="Template ToC" className="mb-6" />

                    {generatedContent && (
                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="font-medium">Generated Template</h2>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generatedContent)}
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

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Template Information</h2>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Template Name</p>
                          <p className="font-medium">{template.name}</p>
                        </div>
                      </div>

                      {template.description && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <Markdown remarkPlugins={[remarkGfm]}>{template.description}</Markdown>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Tags</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.tags.filter(tag => !tag.startsWith("company:")).map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Used by Companies</p>
                          <AvatarCircles numPeople={template.tags.filter(tag => tag.startsWith("company:")).length} avatarUrls={template.tags.filter(tag => tag.startsWith("company:")).map((tag) => ({
                            imageUrl: `https://img.logo.dev/${tag.replace("company:", "").toLowerCase()}.com?token=pk_cSnAqNxhTVafx_G7shrBBg&size=50&retina=true`,
                            profileUrl: `https://${tag.replace("company:", "").toLowerCase()}.com`,
                          }))} />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateTemplate}
                      className="w-full bg-[#d97757] hover:bg-[#c86a4a] text-white mt-6"
                      disabled={generateTemplateMutation.isPending}
                    >
                      {generateTemplateMutation.isPending ? "Generating..." : "Generate Template"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Start Writing in Cursor</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      Copy one of these prompts to get started with AI assistance in Cursor:
                    </p>

                    <div className="space-y-3">
                      {(() => {
                        const prompts = getAIPrompts();
                        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                        return (
                          <div
                            className="bg-white border border-gray-200 rounded-md p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm code bg-gray-100 p-2 rounded-md">{randomPrompt}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(randomPrompt)}
                              className="h-8 w-8 p-0"
                            >
                              <Clipboard className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
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