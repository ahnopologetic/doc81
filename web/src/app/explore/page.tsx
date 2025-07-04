"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Heart,
    Search,
    Filter,
    TrendingUp,
    Star,
    Clock,
    Building2,
    FileText,
    AlertTriangle,
    Book,
    Code,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

interface Template {
    id: string
    name: string
    description: string
    tags: string[]
    companies: string[]
    likes: number
    type: "runbook" | "post mortem" | "open source readme" | "development"
    popularity: number
    isRecommended: boolean
    createdAt: string
    author: string
    preview: string
}

const mockTemplates: Template[] = [
    {
        id: "1",
        name: "Production Incident Runbook",
        description:
            "Comprehensive guide for handling production incidents with step-by-step procedures and escalation paths.",
        tags: ["incident-response", "production", "sre", "monitoring"],
        companies: ["meta", "netflix", "google"],
        likes: 1247,
        type: "runbook",
        popularity: 95,
        isRecommended: true,
        createdAt: "2024-01-15",
        author: "SRE Team",
        preview:
            "# Production Incident Response\n\n## Immediate Actions\n1. Assess severity\n2. Create incident channel...",
    },
    {
        id: "2",
        name: "Database Migration Post-Mortem",
        description:
            "Template for documenting database migration failures, root cause analysis, and prevention strategies.",
        tags: ["database", "migration", "post-mortem", "analysis"],
        companies: ["apple", "nvidia", "meta"],
        likes: 892,
        type: "post mortem",
        popularity: 87,
        isRecommended: true,
        createdAt: "2024-01-20",
        author: "Database Team",
        preview: "# Database Migration Post-Mortem\n\n## Summary\nOn January 15th, our database migration...",
    },
    {
        id: "3",
        name: "React Component Library README",
        description:
            "Professional README template for React component libraries with installation, usage, and contribution guidelines.",
        tags: ["react", "components", "documentation", "open-source"],
        companies: ["meta", "netflix", "apple"],
        likes: 2156,
        type: "open source readme",
        popularity: 98,
        isRecommended: true,
        createdAt: "2024-01-10",
        author: "Frontend Team",
        preview: "# Component Library\n\nA modern React component library built with TypeScript...",
    },
    {
        id: "4",
        name: "API Development Guidelines",
        description: "Comprehensive development standards for REST API design, authentication, and best practices.",
        tags: ["api", "rest", "development", "standards"],
        companies: ["google", "nvidia", "mango"],
        likes: 1543,
        type: "development",
        popularity: 91,
        isRecommended: false,
        createdAt: "2024-01-25",
        author: "Backend Team",
        preview: "# API Development Guidelines\n\n## Design Principles\n- RESTful design\n- Consistent naming...",
    },
    {
        id: "5",
        name: "Kubernetes Deployment Runbook",
        description: "Step-by-step guide for deploying applications to Kubernetes clusters with troubleshooting tips.",
        tags: ["kubernetes", "deployment", "devops", "containers"],
        companies: ["google", "netflix", "nvidia"],
        likes: 1876,
        type: "runbook",
        popularity: 93,
        isRecommended: true,
        createdAt: "2024-01-12",
        author: "DevOps Team",
        preview: "# Kubernetes Deployment\n\n## Prerequisites\n- kubectl configured\n- Access to cluster...",
    },
    {
        id: "6",
        name: "Security Breach Post-Mortem",
        description: "Template for documenting security incidents, impact assessment, and remediation steps.",
        tags: ["security", "breach", "incident", "compliance"],
        companies: ["apple", "meta", "google"],
        likes: 743,
        type: "post mortem",
        popularity: 82,
        isRecommended: false,
        createdAt: "2024-01-30",
        author: "Security Team",
        preview: "# Security Incident Post-Mortem\n\n## Incident Overview\nOn January 28th, we detected...",
    },
    {
        id: "7",
        name: "Machine Learning Model README",
        description: "Template for documenting ML models with training data, performance metrics, and usage instructions.",
        tags: ["machine-learning", "ai", "model", "documentation"],
        companies: ["nvidia", "google", "meta"],
        likes: 1324,
        type: "open source readme",
        popularity: 89,
        isRecommended: true,
        createdAt: "2024-01-18",
        author: "ML Team",
        preview: "# ML Model Documentation\n\n## Model Overview\nThis model predicts customer churn...",
    },
    {
        id: "8",
        name: "Code Review Guidelines",
        description:
            "Development standards for code reviews, including checklists, best practices, and approval processes.",
        tags: ["code-review", "development", "quality", "standards"],
        companies: ["mango", "apple", "netflix"],
        likes: 967,
        type: "development",
        popularity: 85,
        isRecommended: false,
        createdAt: "2024-02-01",
        author: "Engineering Team",
        preview: "# Code Review Guidelines\n\n## Review Process\n1. Create pull request\n2. Assign reviewers...",
    },
]

const companyColors = {
    meta: "bg-blue-100 text-blue-800",
    apple: "bg-gray-100 text-gray-800",
    netflix: "bg-red-100 text-red-800",
    nvidia: "bg-green-100 text-green-800",
    google: "bg-yellow-100 text-yellow-800",
    mango: "bg-orange-100 text-orange-800",
}

const typeIcons = {
    runbook: FileText,
    "post mortem": AlertTriangle,
    "open source readme": Book,
    development: Code,
}

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<"popularity" | "recommended" | "new">("recommended")
    const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set())

    const filteredAndSortedTemplates = useMemo(() => {
        const filtered = mockTemplates.filter((template) => {
            const matchesSearch =
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCompany =
                selectedCompanies.length === 0 || selectedCompanies.some((company) => template.companies.includes(company))

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(template.type)

            return matchesSearch && matchesCompany && matchesType
        })

        // Sort templates
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "popularity":
                    return b.popularity - a.popularity
                case "recommended":
                    if (a.isRecommended && !b.isRecommended) return -1
                    if (!a.isRecommended && b.isRecommended) return 1
                    return b.popularity - a.popularity
                case "new":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                default:
                    return 0
            }
        })

        return filtered
    }, [searchQuery, selectedCompanies, selectedTypes, sortBy])

    const toggleCompanyFilter = (company: string) => {
        setSelectedCompanies((prev) => (prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]))
    }

    const toggleTypeFilter = (type: string) => {
        setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    }

    const toggleLike = (templateId: string) => {
        setLikedTemplates((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(templateId)) {
                newSet.delete(templateId)
            } else {
                newSet.add(templateId)
            }
            return newSet
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Templates</h1>
                    <p className="text-xl text-gray-600 max-w-2xl">
                        Discover professionally crafted documentation templates used by top tech companies
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search templates, tags, or descriptions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-lg border-gray-200 focus:border-[#d97757] focus:ring-[#d97757]"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-6 items-center">
                        {/* Company Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Building2 className="w-4 h-4 mr-2" />
                                Companies
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {["mango", "meta", "apple", "netflix", "nvidia", "google"].map((company) => (
                                    <Button
                                        key={company}
                                        variant={selectedCompanies.includes(company) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleCompanyFilter(company)}
                                        className={
                                            selectedCompanies.includes(company)
                                                ? "bg-[#d97757] hover:bg-[#c86a4a] text-white"
                                                : "border-gray-200 hover:border-[#d97757] hover:text-[#d97757]"
                                        }
                                    >
                                        #{company}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {["runbook", "post mortem", "open source readme", "development"].map((type) => (
                                    <Button
                                        key={type}
                                        variant={selectedTypes.includes(type) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleTypeFilter(type)}
                                        className={
                                            selectedTypes.includes(type)
                                                ? "bg-[#d97757] hover:bg-[#c86a4a] text-white"
                                                : "border-gray-200 hover:border-[#d97757] hover:text-[#d97757]"
                                        }
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sort by</label>
                            <Select value={sortBy} onValueChange={(value: "recommended" | "popularity" | "new") => setSortBy(value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recommended">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 mr-2" />
                                            Recommended
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="popularity">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Popularity
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="new">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Newest
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedCompanies.length > 0 || selectedTypes.length > 0) && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            {selectedCompanies.map((company) => (
                                <Badge
                                    key={company}
                                    variant="secondary"
                                    className="bg-[#d97757] text-white hover:bg-[#c86a4a] cursor-pointer"
                                    onClick={() => toggleCompanyFilter(company)}
                                >
                                    #{company} ×
                                </Badge>
                            ))}
                            {selectedTypes.map((type) => (
                                <Badge
                                    key={type}
                                    variant="secondary"
                                    className="bg-[#d97757] text-white hover:bg-[#c86a4a] cursor-pointer"
                                    onClick={() => toggleTypeFilter(type)}
                                >
                                    {type} ×
                                </Badge>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedCompanies([])
                                    setSelectedTypes([])
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedTemplates.map((template) => {
                        const TypeIcon = typeIcons[template.type]
                        const isLiked = likedTemplates.has(template.id)

                        return (
                            <Card
                                key={template.id}
                                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm"
                            >
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
                                                <TypeIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="text-xs">
                                                    {template.type}
                                                </Badge>
                                                {template.isRecommended && (
                                                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        Recommended
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleLike(template.id)}
                                            className={`p-2 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                        </Button>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#d97757] transition-colors">
                                                {template.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">{template.description}</p>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1">
                                            {template.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {template.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                                    +{template.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Companies */}
                                        <div className="flex flex-wrap gap-1">
                                            {template.companies.map((company) => (
                                                <Badge
                                                    key={company}
                                                    className={`text-xs ${companyColors[company as keyof typeof companyColors]}`}
                                                >
                                                    #{company}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{template.likes.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>{template.popularity}%</span>
                                                </div>
                                            </div>
                                            <Button size="sm" className="bg-[#d97757] hover:bg-[#c86a4a] text-white">
                                                Use Template
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredAndSortedTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or filters to find what you&apos;re looking for.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCompanies([])
                                setSelectedTypes([])
                            }}
                            variant="outline"
                            className="border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white"
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
