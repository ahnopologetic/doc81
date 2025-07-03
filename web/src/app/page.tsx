"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Sparkles, Edit3, Zap, Users } from "lucide-react"
import { MarkdownCanvas } from "@/components/markdown-canvas"

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
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MarkdownAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-[#d97757] transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-[#d97757] transition-colors">
              Pricing
            </a>
            <Button
              variant="outline"
              className="border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white bg-transparent"
            >
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your <span className="text-[#d97757]">Markdown</span> with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload or paste your markdown content and watch it come to life with our AI-powered editor. Edit, enhance,
            and perfect your content with intelligent suggestions.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>10K+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
          </div>
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

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Modern Writers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, edit, and perfect your markdown content with the power of AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#d97757] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Editing</h3>
              <p className="text-gray-600">
                Get intelligent suggestions and improvements for your content with advanced AI assistance
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#d97757] rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Editor</h3>
              <p className="text-gray-600">
                Full-featured markdown editor with live preview, syntax highlighting, and more
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#d97757] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Instant processing and real-time collaboration for seamless workflow</p>
            </div>
          </div>
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
