"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Download, Copy, Wand2, Eye, Edit, Save } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import { useGenerateTemplate } from "@/hooks/use-templates"

interface MarkdownCanvasProps {
    isOpen: boolean
    onClose: () => void
    initialContent: string
    onContentChange: (content: string) => void
}

export function MarkdownCanvas({ isOpen, onClose, initialContent, onContentChange }: MarkdownCanvasProps) {
    const [content, setContent] = useState(initialContent)
    const [isGenerating, setIsGenerating] = useState(false)
    const generateTemplateMutation = useGenerateTemplate()

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])

    const handleContentChange = (newContent: string) => {
        setContent(newContent)
        onContentChange(newContent)
    }

    const handleAIEnhance = async () => {
        setIsGenerating(true)

        const result = await generateTemplateMutation.mutateAsync({
            raw_markdown: content,
        })
        console.log(result)

        // Add some AI enhancements to the content
        const enhancedContent = result

        handleContentChange(enhancedContent)
        setIsGenerating(false)
        toast.success("Content Enhanced!", {
            description: "AI has added suggestions and improvements to your markdown.",
        })
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        toast.success("Copied!", {
            description: "Markdown content copied to clipboard.",
        })
    }

    const handleDownload = () => {
        const blob = new Blob([content], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "enhanced-content.md"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("Downloaded!", {
            description: "Your markdown file has been downloaded.",
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            {/* Canvas */}
            <div
                className={`w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
                                <Edit className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">AI Markdown Canvas</h2>
                                <p className="text-sm text-gray-500">Edit and enhance your content</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleAIEnhance}
                                disabled={isGenerating}
                                className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                            >
                                <Wand2 className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                                {isGenerating ? "Enhancing..." : "AI Enhance"}
                            </Button>

                            <Button variant="outline" onClick={handleCopy}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>

                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>

                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <Tabs defaultValue="edit" className="h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                                <TabsTrigger value="edit" className="flex items-center space-x-2">
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="flex items-center space-x-2">
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="edit" className="flex-1 m-4 mt-2">
                                <Card className="h-full">
                                    <CardContent className="p-4 h-full">
                                        <Textarea
                                            value={content}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            className="h-full resize-none border-0 focus:ring-0 focus:border-0 text-sm font-mono"
                                            placeholder="Start editing your markdown content..."
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="preview" className="flex-1 m-4 mt-2">
                                <Card className="h-full">
                                    <CardContent className="p-6 h-full overflow-auto">
                                        <div className="prose prose-gray max-w-none">
                                            <ReactMarkdown>{content}</ReactMarkdown>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {content.length} characters • {content.split("\n").length} lines
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    toast.success("Saved!", {
                                        description: "Your changes have been saved.",
                                    })
                                }}
                                className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
