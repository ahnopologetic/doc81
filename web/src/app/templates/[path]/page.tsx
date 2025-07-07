"use client";

import { Header } from "@/components/header";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import MarkdownCollapsibleTimeline from "@/components/markdown-collapsible-timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLikeTemplate, useTemplate } from "@/hooks";
import { useAuth } from "@/lib/supabase/auth-context";
import { Separator } from "@radix-ui/react-select";
import { ArrowLeft, Building, Copy, FileText, Heart, Send, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

const COPYRIGHT_HEADER = `{/* 
This template is copyrighted by Doc81 (https://doc81.ahnopologetic.xyz/; https://github.com/ahnopologetic/doc81).
You are free to use this template for your own purposes, but you must give credit to Doc81.
*/}
`

export default function TemplateDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const decodedPath = decodeURIComponent(params.path as string);
  const { data: template, isLoading, error } = useTemplate(decodedPath);
  const { mutate: likeTemplate } = useLikeTemplate();
  // const [variables, setVariables] = useState<Record<string, string>>({});

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


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4 px-6">
                    <div className="grid grid-cols-1 gap-4">
                      <Label>
                        Actions
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-3">

                          <Select defaultValue="cursor">
                            <SelectTrigger className="w-full bg-white hover:bg-white col-span-3">
                              {/* <BotIcon className="h-4 w-4" /> */}
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cursor">
                                <div className="flex items-center gap-2">
                                  <Image src={`https://img.logo.dev/cursor.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`} alt="Cursor" width={20} height={20} />
                                  Cursor
                                </div>
                              </SelectItem>
                              <SelectItem value="claude">
                                <div className="flex items-center gap-2">
                                  <Image src={`https://img.logo.dev/claude.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`} alt="Claude" width={20} height={20} />
                                  Claude
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center col-span-1">
                          <HoverCard>
                            <HoverCardTrigger>
                              <Button variant="ghost" size="sm" className="w-full cursor-pointer" onClick={async () => {
                                copyToClipboard(`doc81: Start writing a ${template.name} based on best practices (ref=${template.id})`);
                                if (user) {
                                  await likeTemplate({ templateId: template.id, userId: user.id }, {
                                    onSuccess: () => {
                                      toast.success("Liked template", {
                                        icon: <Heart className="w-4 h-4 text-green-500" />,
                                      });
                                    },
                                    onError: () => {
                                      toast.error("Failed to like template", {
                                        icon: <Heart className="w-4 h-4 text-red-500" />,
                                      });
                                    },
                                  });
                                }
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                router.push('cursor://anysphere.cursor-deeplink')
                              }}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between gap-4">
                                <Avatar>
                                  <AvatarImage src={`https://img.logo.dev/cursor.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`} />
                                  <AvatarFallback>
                                    <Image src={`https://img.logo.dev/cursor.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`} alt="Cursor" width={20} height={20} />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm font-bold">
                                    Copy and paste this into your cursor chat
                                  </p>
                                  <p className="text-sm text-gray-500 font-mono code bg-gray-100 p-2 rounded-md">
                                    doc81: Start writing a {template.name} based on best practices (ref={template.id})
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    But before that, <br />
                                    Did you setup doc81 MCP? <Link href="/mcp" className="underline">Learn more</Link>
                                  </p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          <Button variant="ghost" size="sm" className="w-full cursor-pointer" onClick={async () => {
                            if (!user) {
                              toast.error("Please login to copy raw markdown to clipboard", {
                                icon: <FileText className="h-4 w-4" />,
                                action: {
                                  label: "Login",
                                  onClick: () => {
                                    router.push('/auth/login');
                                  }
                                }
                              });
                              return;
                            }
                            copyToClipboard(COPYRIGHT_HEADER + template.content)
                            await likeTemplate({ templateId: template.id, userId: user.id }, {
                              onSuccess: () => {
                                toast.success("Liked template", {
                                  icon: <Heart className="w-4 h-4 text-green-500" />,
                                });
                              },
                              onError: (error) => {
                                toast.error("Failed to like template", {
                                  icon: <Heart className="w-4 h-4 text-red-500" />,
                                  description: error.message,
                                });
                              },
                            });
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Did you setup doc81 MCP? <Link href="/mcp" className="underline">Learn more</Link>
                      </p>
                      <Separator />
                      <Label>
                        Template Details
                      </Label>
                      <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Template Name</p>
                          <p className="font-medium">{template.name}</p>
                        </div>
                      </div>

                      {template.description && (
                        <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <Markdown remarkPlugins={[remarkGfm]}>{template.description}</Markdown>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
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

                      {template.tags.filter(tag => tag.startsWith("company:")).length > 0 && (
                        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                          <Building className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Used by Companies</p>
                            <AvatarCircles numPeople={template.tags.filter(tag => tag.startsWith("company:")).length} avatarUrls={template.tags.filter(tag => tag.startsWith("company:")).map((tag) => ({
                              imageUrl: `https://img.logo.dev/${tag.replace("company:", "").toLowerCase()}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`,
                              profileUrl: `https://${tag.replace("company:", "").toLowerCase()}.com`,
                            }))} />
                          </div>
                        </div>
                      )}
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
} 