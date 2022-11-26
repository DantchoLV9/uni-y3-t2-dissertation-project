import ApplicationLogo from './ApplicationLogo'
import Head from 'next/head'

const LoadingScreen = () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME
    return (
        <>
            <Head>
                <title>{appName}</title>
            </Head>
            <div className="w-screen h-screen bg-gray-100 flex justify-center items-center flex-col">
                <div>
                    <ApplicationLogo className="w-48 h-48" />
                </div>
                <h1 className="text-2xl">Loading</h1>
            </div>
        </>
    )
}

export default LoadingScreen
