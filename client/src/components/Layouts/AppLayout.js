import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'

const AppLayout = ({ pageTitle, children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const appName = process.env.NEXT_PUBLIC_APP_NAME
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>
                    {pageTitle ? `${appName} - ${pageTitle}` : appName}
                </title>
            </Head>

            <Navigation user={user} />

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
