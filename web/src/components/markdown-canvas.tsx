"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Download, Copy, Wand2, Eye, Edit, Save } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import { useGenerateTemplate, useSaveTemplate } from "@/hooks/use-templates"
import remarkGfm from "remark-gfm"
import { useAuth } from "@/lib/supabase/auth-context"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

// Define validation schema using Zod
const templateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name is too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
    tags: z.string().min(3, "Please add at least one tag"),
    content: z.string().min(20, "Content must be at least 20 characters")
})

type TemplateFormData = z.infer<typeof templateSchema>

interface MarkdownCanvasProps {
    isOpen: boolean
    onClose: () => void
    initialContent: string
    onContentChange: (content: string) => void
}

export function MarkdownCanvas({ isOpen, onClose, initialContent, onContentChange }: MarkdownCanvasProps) {
    const { user } = useAuth()
    const router = useRouter()

    const [content, setContent] = useState(initialContent)
    const [isGenerating, setIsGenerating] = useState(false)
    const [templateDescription, setTemplateDescription] = useState("")
    const [templateTags, setTemplateTags] = useState("")
    const generateTemplateMutation = useGenerateTemplate()
    const saveTemplateMutation = useSaveTemplate()
    const [templateName, setTemplateName] = useState("")

    // Add validation errors state
    const [errors, setErrors] = useState<Partial<Record<keyof TemplateFormData, string>>>({})

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])

    const handleContentChange = (newContent: string) => {
        setContent(newContent)
        onContentChange(newContent)
        // Clear content error when user types
        if (errors.content) {
            setErrors(prev => ({ ...prev, content: undefined }))
        }
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

    const validateForm = (): boolean => {
        try {
            templateSchema.parse({
                name: templateName,
                description: templateDescription,
                tags: templateTags,
                content
            })
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof TemplateFormData, string>> = {}
                error.errors.forEach(err => {
                    const path = err.path[0] as keyof TemplateFormData
                    newErrors[path] = err.message
                })
                setErrors(newErrors)

                // Show toast with first error
                if (error.errors.length > 0) {
                    toast.error("Validation Error", {
                        description: error.errors[0].message
                    })
                }
            }
            return false
        }
    }

    const handleSave = () => {
        if (!user) {
            toast.error("Please login first.", {
                description: "You need to be logged in to save your changes.",
                action: {
                    label: "Login",
                    onClick: () => {
                        router.push("/auth/login")
                    },
                },
            })
            return
        }

        // Validate form before saving
        if (!validateForm()) {
            return
        }

        saveTemplateMutation.mutate({
            name: templateName,
            content: content,
            description: templateDescription,
            tags: templateTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }, {
            onSuccess: (data) => {
                router.push(`/templates/${data.id}`)
                toast.success("Saved!", {
                    description: "Your changes have been saved.",
                })
            },
            onError: (error) => {
                toast.error("Error saving template", {
                    description: error.message,
                })
            }
        })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="w-full max-w-4xl bg-white shadow-2xl"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
                                        <Edit className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Doc81 Canvas</h2>
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
                            <div className="flex-1">
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

                                    <TabsContent value="edit" className="flex-1 m-4 mt-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                                        <Card className="h-full">
                                            <CardContent className="px-4 py-2 h-full overflow-y-auto">
                                                <div className="flex flex-col">
                                                    <Label className="text-sm font-medium text-gray-700 mb-1">Template Name</Label>
                                                    <Input
                                                        value={templateName}
                                                        onChange={(e) => {
                                                            setTemplateName(e.target.value)
                                                            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                                                        }}
                                                        className={`w-full mb-1 ${errors.name ? 'border-red-500' : ''}`}
                                                        placeholder="Name of the template"
                                                    />
                                                    {errors.name && <p className="text-xs text-red-500 mb-2">{errors.name}</p>}
                                                    <div className="mb-6"></div>

                                                    <Label className="text-sm font-medium text-gray-700 mb-1">Description</Label>
                                                    <Input
                                                        value={templateDescription}
                                                        onChange={(e) => {
                                                            setTemplateDescription(e.target.value)
                                                            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }))
                                                        }}
                                                        className={`w-full mb-1 ${errors.description ? 'border-red-500' : ''}`}
                                                        placeholder="What is this template about?"
                                                    />
                                                    {errors.description && <p className="text-xs text-red-500 mb-2">{errors.description}</p>}
                                                    <div className="mb-6"></div>

                                                    <Label className="text-sm font-medium text-gray-700 mb-1">Tags</Label>
                                                    <Input
                                                        value={templateTags}
                                                        onChange={(e) => {
                                                            setTemplateTags(e.target.value)
                                                            if (errors.tags) setErrors(prev => ({ ...prev, tags: undefined }))
                                                        }}
                                                        className={`w-full mb-1 ${errors.tags ? 'border-red-500' : ''}`}
                                                        placeholder="Tags (comma separated)"
                                                    />
                                                    {errors.tags && <p className="text-xs text-red-500 mb-2">{errors.tags}</p>}
                                                    <div className="mb-6"></div>

                                                    <Label className="text-sm font-medium text-gray-700 mb-1">Template Content</Label>
                                                    <Textarea
                                                        value={content}
                                                        onChange={(e) => handleContentChange(e.target.value)}
                                                        className={`h-full resize-none focus:ring-0 focus:border-0 text-sm ${errors.content ? 'border-red-500' : ''}`}
                                                        placeholder="Start editing your markdown content..."
                                                    />
                                                    {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="preview" className="flex-1 m-4 mt-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                                        <Card className="h-full">
                                            <CardContent className="p-6 h-full overflow-auto">
                                                <div className="prose prose-gray max-w-none font-serif bg-gray-50 p-4 rounded-lg">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
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
                                        onClick={handleSave}
                                        className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}