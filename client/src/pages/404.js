import Link from 'next/link'
import ApplicationLogo from '@/components/ApplicationLogo'

const NotFoundPage = () => (
    <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - 404 Not Found</title>
        <div className="max-w-xl mx-auto sm:px-6 lg:px-8 flex justify-center items-center flex-col">
            <Link href="/">
                <a className="mb-5">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </a>
            </Link>
            <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
                <div className="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">
                    404
                </div>

                <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">
                    Not Found
                </div>
            </div>
            <Link href="/">
                <a className="underline text-sm text-gray-600 hover:text-gray-900 mt-5">
                    Go Home
                </a>
            </Link>
        </div>
    </div>
)

export default NotFoundPage
