import { Button } from "@/components/ui/button"
import { UploadMediaDialog } from "@/components/admin/upload-media-dialog"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Copy } from "lucide-react"

async function getMedia() {
    try {
        return await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch {
        return []
    }
}

export default async function MediaPage() {
    const files = await getMedia()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage your images and documents.
                    </p>
                </div>
                <UploadMediaDialog />
            </div>

            {files.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
                    No media files found. Upload some!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map((file) => (
                        <Card key={file.id} className="overflow-hidden group relative">
                            <div className="aspect-square relative bg-slate-100">
                                {file.type.startsWith('image/') ? (
                                    <Image
                                        src={file.url}
                                        alt={file.filename}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        {file.type}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-2">
                                <p className="text-sm font-medium truncate">{file.filename}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
