"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Sparkles } from "lucide-react"
import { MarkdownCanvas } from "@/components/markdown-canvas"
import { TemplateCarousel } from "@/components/template-carousel"
import { Header } from "@/components/header"

export default function LandingPage() {
  const [markdownContent, setMarkdownContent] = useState("")
  const [showCanvas, setShowCanvas] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === "text/markdown" || file.name.endsWith(".md")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdownContent(content)
      }
      reader.readAsText(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  const handleSubmit = () => {
    if (markdownContent.trim()) {
      setShowCanvas(true)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Ready-to-Use Templates</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our collection of professional templates for various documentation needs
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <TemplateCarousel />
        </div>
      </section>

      {/* Main Input Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get Started with Your Markdown</h2>
                  <p className="text-gray-600">Type your content below or upload a markdown file to begin</p>
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragOver
                      ? "border-[#d97757] bg-orange-50"
                      : "border-gray-300 hover:border-[#d97757] hover:bg-orange-50/50"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop your markdown file here</p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label htmlFor="file-upload">
                    <Button
                      variant="outline"
                      className="border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white bg-transparent"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Or type your markdown content:</label>
                  <Textarea
                    placeholder="# Welcome to MarkdownAI

Start typing your markdown content here...

## Features
- AI-powered editing
- Real-time preview
- Smart suggestions

**Bold text** and *italic text* are supported!"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="min-h-[200px] resize-none border-gray-200 focus:border-[#d97757] focus:ring-[#d97757]"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={!markdownContent.trim()}
                    className="bg-[#d97757] hover:bg-[#c86a4a] text-white px-8 py-3 text-lg font-medium"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Canvas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Canvas Component */}
      <MarkdownCanvas
        isOpen={showCanvas}
        onClose={() => setShowCanvas(false)}
        initialContent={markdownContent}
        onContentChange={setMarkdownContent}
      />
    </div>
  )
}
