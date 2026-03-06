import { prisma } from "@/lib/prisma"
import { InteractiveChecklist } from "./interactive-checklist"

export async function VaultAssetWidget({ id }: { id: string }) {
    try {
        const asset = await prisma.aIGeneratedAsset.findUnique({
            where: { id },
        })

        if (!asset || asset.type !== 'vault') {
            return null
        }

        return (
            <InteractiveChecklist
                assetId={asset.id}
                topic={asset.topic}
                content={asset.content}
            />
        )
    } catch (error) {
        console.error("Failed to load Vault Asset:", error)
        return null
    }
}
