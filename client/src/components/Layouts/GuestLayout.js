import Head from 'next/head'

const GuestLayout = ({ pageTitle, children }) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME
    return (
        <div>
            <Head>
                <title>
                    {pageTitle ? `${appName} - ${pageTitle}` : appName}
                </title>
            </Head>

            <div className="font-sans text-gray-900 antialiased">
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
