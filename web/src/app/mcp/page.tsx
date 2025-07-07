/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { defineStepper } from "@stepperize/react";
import React from "react";
import { Separator } from "@/components/ui/separator";

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
const PrerequisitesComponent = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Prerequisites</h3>
            <p>Before installing Doc81 MCP, you need to install <code>uv</code>, a fast Python package installer and resolver.</p>

            <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2">Install uv</h4>
                <p className="mb-2">Run the following command in your terminal:</p>
                <pre className="bg-black text-white p-3 rounded overflow-x-auto">
                    <code>curl -LsSf https://astral.sh/uv/install.sh | sh</code>
                </pre>

                <p className="mt-3 text-sm text-gray-600">
                    For more installation options, visit the <a href="https://github.com/astral-sh/uv" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">uv GitHub repository</a>.
                </p>
            </div>

            <p>Once uv is installed, you can proceed with the Doc81 MCP installation.</p>
        </div>
    );
}
const InstallationComponent = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Installation</h3>
            <p>To install Doc81 MCP, please ensure you&apos;re using a desktop environment with Cursor installed.</p>

            <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2">Choose your configuration mode:</h4>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Local Mode:</strong> Use this if you want to use your own local template files. You&apos;ll need to specify your local prompt directory.</li>
                    <li><strong>Server Mode:</strong> Use this if you want to access templates offered by Doc81&apos;s server.</li>
                </ul>

                <p className="mb-2">Select your preferred mode in the configuration panel on the right, then click &quot;Add to Cursor&quot; to install.</p>
            </div>

            <p className="text-sm text-gray-600">
                Once you&apos;ve added the configuration to Cursor, you&apos;ll be able to use Doc81 MCP to manage your templates.
            </p>

            <div className="bg-gray-100 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Setup MCP-specific prompts (Recommended)</h4>
                <p className="mb-2">For optimal results, we recommend setting up MCP-specific prompts:</p>
                <pre className="bg-black text-white p-3 rounded overflow-x-auto">
                    uvx --from doc81 doc81-mcp-cli setup
                </pre>
                <p className="mt-3 text-sm text-gray-600">
                    This will configure your environment with specialized prompts designed to enhance your Doc81 MCP experience.
                </p>
                <p className="mt-3 text-sm text-gray-600">
                    Include this <code>.cursor/rules/doc81.mdc</code> in your Cursor chat context for the best experience.
                </p>
            </div>
        </div>
    );
}
const EnjoyComponent = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Enjoy Doc81 MCP</h3>
            <p>You can now use Doc81 MCP to create high-quality documentation using two modes:</p>
            
            <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2">Documentation Modes:</h4>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Waterfall Mode:</strong> Generates a full document skeleton with placeholders that you can fill in at your own pace.</li>
                    <li><strong>Interactive Mode:</strong> Guides you through the documentation process one question at a time, ensuring comprehensive responses.</li>
                </ul>
                
                <p className="mb-2">Open Cursor Chat and interact with Doc81 powered agents!</p>
                
                <p className="mt-3 text-sm text-gray-600">
                    For more information about available templates and usage options, refer to the documentation in your prompt directory.
                </p>
            </div>
        </div>
    );
}

const { useStepper, steps, utils } = defineStepper(
    {
        id: 'prerequisites',
        title: 'Prerequisites',
        description: 'Install the prerequisites',
    },
    {
        id: 'installation',
        title: 'Installation',
        description: 'Install the MCP',
    },
    { id: 'enjoy', title: 'Enjoy', description: 'Enjoy Doc81' }
);

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
    const stepper = useStepper();

    const currentIndex = utils.getIndex(stepper.current.id);

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-12 text-center">Doc81 MCP</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-amber-700">
                                                Please go through this part first before proceeding with the installation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    Step {currentIndex + 1} of {steps.length}
                                </div>
                                <nav aria-label="Checkout Steps" className="group my-4 max-w-md mx-auto">
                                    <ol className="flex flex-col gap-2" aria-orientation="vertical">
                                        {stepper.all.map((step, index, array) => (
                                            <React.Fragment key={step.id}>
                                                <li className="flex items-center gap-4 flex-shrink-0">
                                                    <Button
                                                        type="button"
                                                        role="tab"
                                                        variant={index <= currentIndex ? 'default' : 'secondary'}
                                                        aria-current={
                                                            stepper.current.id === step.id ? 'step' : undefined
                                                        }
                                                        aria-posinset={index + 1}
                                                        aria-setsize={steps.length}
                                                        aria-selected={stepper.current.id === step.id}
                                                        className="flex size-10 items-center justify-center rounded-full"
                                                        onClick={() => stepper.goTo(step.id)}
                                                    >
                                                        {index + 1}
                                                    </Button>
                                                    <span className="text-sm font-medium">{step.title}</span>
                                                </li>
                                                <div className="flex gap-4">
                                                    {index < array.length - 1 && (
                                                        <div
                                                            className="flex justify-center"
                                                            style={{
                                                                paddingInlineStart: '1.25rem',
                                                            }}
                                                        >
                                                            <Separator
                                                                orientation="vertical"
                                                                className={`w-[1px] h-full ${index < currentIndex ? 'bg-primary' : 'bg-muted'
                                                                    }`}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 my-4 max-w-md mx-auto overflow-x-auto">
                                                        {stepper.current.id === step.id &&
                                                            stepper.switch({
                                                                installation: () => <InstallationComponent />,
                                                                prerequisites: () => <PrerequisitesComponent />,
                                                                enjoy: () => <EnjoyComponent />,
                                                            })}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </ol>
                                </nav>


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
