import BaseLayout from '@/components/layouts/OperatoreLayout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BaseLayout>{children}</BaseLayout>
} 