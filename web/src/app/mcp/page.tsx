"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, PlusCircle, Terminal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

const localModeJSON = {
    "doc81": {
        "command": "uvx",
        "args": [
            "--from",
            "doc81",
            "doc81-mcp"
        ],
        "env": {
            "DOC81_PROMPT_DIR": "<your local prompt directory>"
        }
    }
}

const serverModeJSON = {
    "doc81": {
        "command": "uvx",
        "args": [
            "--from",
            "doc81",
            "doc81-mcp"
        ],
        "env": {
            "DOC81_MODE": "server"
        }
    }
}

export default function MCPPage() {
    const [activeTab, setActiveTab] = useState<string>("local");
    const router = useRouter();

    const copyToClipboard = () => {
        const textToCopy = activeTab === "local" ? JSON.stringify(localModeJSON) : JSON.stringify(serverModeJSON);
        navigator.clipboard.writeText(textToCopy);
        toast.success("Configuration copied to clipboard");
    };

    const addToCursor = () => {
        const encodedContent = activeTab === "local" ? "eyJjb21tYW5kIjoidXZ4IC0tZnJvbSBkb2M4MSBkb2M4MS1tY3AiLCJlbnYiOnsiRE9DODFfUFJPTVBUX0RJUiI6Ijx5b3VyIGxvY2FsIHByb21wdCBkaXJlY3Rvcnk%252BIn19" : "eyJjb21tYW5kIjoidXZ4IC0tZnJvbSBkb2M4MSBkb2M4MS1tY3AiLCJlbnYiOnsiRE9DODFfTU9ERSI6InNlcnZlciJ9fQ%3D%3D"
        router.push(`cursor://anysphere.cursor-deeplink/mcp/install?name=doc81&config=${encodedContent}`);
    };

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-12 text-center">Doc81 MCP</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left side: Explanation */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                    <Terminal className="mr-2 h-6 w-6 text-[#d97757]" />
                                    What is MCP?
                                </h2>
                                <p className="mb-4">
                                    Doc81 MCP is a powerful interface that allows AI assistants to directly
                                    interact with your development environment through AI Assistant like Cursor IDE, Windsurf, Claude, etc.
                                </p>
                                <p className="mb-4">
                                    With Doc81&apos;s MCP integration, you can generate your own documentation from predefined, widely adopted templates, convert existing
                                    documents into templates, and customize your workflow - all through natural language commands.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                    <Code className="mr-2 h-6 w-6 text-[#d97757]" />
                                    How It Works
                                </h2>
                                <ol className="list-decimal pl-5 space-y-3">
                                    <li>
                                        <strong>Add the configuration</strong> to your AI Assistant settings using the JSON editor on the right.
                                        <br />
                                        Or simply click the &quot;Add to Cursor&quot; button.
                                    </li>
                                    <li>
                                        <strong>Choose your mode:</strong> Local for using your own prompt directory, or Server for using Doc81&apos;s API.
                                    </li>
                                    <li>
                                        <strong>Access MCP commands</strong> by typing <code className="bg-gray-100 px-1 py-0.5 rounded">@doc81</code> in Cursor&apos;s chat interface.
                                    </li>
                                    <li>
                                        <strong>Use natural language</strong> to generate templates, convert documents, or customize your documentation workflow.
                                    </li>
                                </ol>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-2">Example Commands</h3>
                                    <ul className="space-y-2">
                                        <li><code className="bg-gray-100 px-1 py-0.5 rounded">@doc81</code> Generate a runbook template for our API service</li>
                                        <li><code className="bg-gray-100 px-1 py-0.5 rounded">@doc81</code> Convert this markdown file into a reusable template</li>
                                        <li><code className="bg-gray-100 px-1 py-0.5 rounded">@doc81</code> Create a documentation template with sections for architecture and API endpoints</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right side: JSON Editor with Tabs */}
                    <div className="sticky top-24">
                        <Card className="overflow-hidden">
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
                                <p className="mb-4 text-gray-600">
                                    Add this configuration to your Cursor settings to enable Doc81 MCP commands.
                                </p>

                                <Tabs defaultValue="local" className="w-full" onValueChange={setActiveTab}>
                                    <TabsList className="grid grid-cols-2 mb-4">
                                        <TabsTrigger value="local">Local Mode</TabsTrigger>
                                        <TabsTrigger value="server">Server Mode</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="local" className="space-y-4">
                                        <div className="relative">
                                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                                {JSON.stringify(localModeJSON, null, 2)}
                                            </pre>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={copyToClipboard}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Use this mode to work with your local prompt directory. Replace <code className="bg-gray-100 px-1 py-0.5 rounded">&lt;your local prompt directory&gt;</code> with the path to your prompts.</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="server" className="space-y-4">
                                        <div className="relative">
                                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                                {JSON.stringify(serverModeJSON, null, 2)}
                                            </pre>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={copyToClipboard}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Use server mode to connect to Doc81&apos;s API for template management and generation.</p>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-6">
                                    <Button
                                        className="w-full bg-[#d97757] hover:bg-[#c86a4a]"
                                        onClick={addToCursor}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add to Cursor
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}
