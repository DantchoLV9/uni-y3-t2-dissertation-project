import Head from 'next/head'
import Link from 'next/link'
import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
    const { user } = useAuth({ middleware: 'auth' })
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    return (
        <>
            <Head>
                <title>{appName}</title>
            </Head>

            {user ? (
                <AppLayout>
                    <Head>
                        <title>{appName} - Dashboard</title>
                    </Head>

                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    You're logged in!
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>
            ) : (
                <LoadingScreen />
            )}
        </>
    )
}
