import { redirect } from 'next/navigation'

export default function DeprecatedBackupsPage() {
    redirect('/admin/settings/backups')
}
