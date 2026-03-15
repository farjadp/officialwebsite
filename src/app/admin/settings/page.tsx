"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Settings2, ShieldCheck, Mail, Send, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        SITE_TITLE: "",
        SITE_SUBTITLE: "",
        SUPPORT_EMAIL: "",
        TELEGRAM_BOT_TOKEN: "",
        TELEGRAM_CHAT_ID: "",
        LINKEDIN_ACCESS_TOKEN: "",
        LINKEDIN_PERSON_URN: "",
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.success && data.settings) {
                    // Merge DB settings with our defaults so we don't overwrite controlled inputs with undefined
                    setSettings(prev => ({ ...prev, ...data.settings }))
                }
            } catch (error) {
                toast.error("Failed to load settings")
            } finally {
                setLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const saveSettings = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Settings saved successfully")
            } else {
                toast.error(data.error || "Failed to save settings")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Site Identity</CardTitle>
                            <CardDescription>
                                Basic information about your website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site_title">Site Title</Label>
                                <Input
                                    id="site_title"
                                    placeholder="e.g. Farjad Official"
                                    value={settings.SITE_TITLE || ""}
                                    onChange={e => handleChange("SITE_TITLE", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site_subtitle">Hero Subtitle</Label>
                                <Input
                                    id="site_subtitle"
                                    placeholder="A short punchy description..."
                                    value={settings.SITE_SUBTITLE || ""}
                                    onChange={e => handleChange("SITE_SUBTITLE", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support_email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" /> Support Email
                                </Label>
                                <Input
                                    id="support_email"
                                    type="email"
                                    placeholder="contact@farjadp.info"
                                    value={settings.SUPPORT_EMAIL || ""}
                                    onChange={e => handleChange("SUPPORT_EMAIL", e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t justify-end py-4">
                            <Button onClick={saveSettings} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-blue-500" /> Telegram Bot
                            </CardTitle>
                            <CardDescription>
                                Used for sending notifications and Private Feeds to your channel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tg_token">Bot Token</Label>
                                <Input
                                    id="tg_token"
                                    type="password"
                                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                                    value={settings.TELEGRAM_BOT_TOKEN || ""}
                                    onChange={e => handleChange("TELEGRAM_BOT_TOKEN", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tg_chat_id">Default Chat ID</Label>
                                <Input
                                    id="tg_chat_id"
                                    placeholder="-100123456789"
                                    value={settings.TELEGRAM_CHAT_ID || ""}
                                    onChange={e => handleChange("TELEGRAM_CHAT_ID", e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t justify-end py-4">
                            <Button onClick={saveSettings} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Integrations
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-blue-700" /> LinkedIn API (Social Publisher)
                            </CardTitle>
                            <CardDescription>
                                Used by the automated Social Publisher to post to your LinkedIn profile. 
                                Note: These tokens are usually set automatically via the OAuth callback.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="li_token">Access Token</Label>
                                <Input
                                    id="li_token"
                                    type="password"
                                    placeholder="AQUX..."
                                    value={settings.LINKEDIN_ACCESS_TOKEN || ""}
                                    onChange={e => handleChange("LINKEDIN_ACCESS_TOKEN", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="li_urn">Person URN</Label>
                                <Input
                                    id="li_urn"
                                    placeholder="urn:li:person:XXXXXXX"
                                    value={settings.LINKEDIN_PERSON_URN || ""}
                                    onChange={e => handleChange("LINKEDIN_PERSON_URN", e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t justify-end py-4">
                            <Button onClick={saveSettings} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Integrations
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced">
                    <Card className="border-rose-200 shadow-sm">
                        <CardHeader className="bg-rose-50/50">
                            <CardTitle className="flex items-center gap-2 text-rose-700">
                                <AlertTriangle className="h-5 w-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Advanced settings that can break functionality if configured incorrectly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-slate-600">No advanced settings available at this time.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
