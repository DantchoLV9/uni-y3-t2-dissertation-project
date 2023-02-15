import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import Link from 'next/link'

export default function Levels() {
    const { user } = useAuth({ middleware: 'auth' })
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Levels Guide">
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-3">
                            <div
                                className={`bg-white overflow-hidden shadow-sm sm:rounded-lg`}>
                                <div className=" bg-white border-b border-gray-200 flex flex-col">
                                    <div className="p-6 flex flex-col">
                                        <h1 className="font-bold text-xl">
                                            Levels Guide
                                        </h1>
                                        <p className="mt-2">
                                            Albor rewards its most active
                                            members by providing access to some
                                            exclusive features.
                                        </p>
                                        <p className="mt-2">
                                            To unlock new features users must be
                                            consistent when it comes to content
                                            creation. With every post made a
                                            user gains a certain amount of
                                            points. The amount of points is
                                            calculated using a number of
                                            different variables.
                                        </p>
                                        <p className="mt-2">
                                            However if a user stops creating
                                            content for more than 24 hours their
                                            level will go down by 1 for every 24
                                            hours they've not produced content.
                                        </p>
                                        <p className="mt-2 font-bold">
                                            This system is still work in
                                            progress, so keep in mind that some
                                            of its features may not work as
                                            expected, or may require further
                                            adjustments.
                                        </p>
                                        <div className="mt-2 bg-gray-100 rounded p-2">
                                            <h2 className="font-bold">
                                                Example widget{' '}
                                                <span className="font-normal">
                                                    (A similar one will appear
                                                    in your profile page)
                                                </span>
                                            </h2>
                                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full ml-auto mt-2">
                                                <div className="p-6 bg-white border-b border-gray-200 flex flex-col gap-3 justify-center items-center">
                                                    <div className="flex-shrink-0 w-full">
                                                        <h3 className="font-bold text-xl text-gray-500 w-full flex justify-between items-center">
                                                            <span className="flex justify-center items-center">
                                                                Level
                                                                <Link href="/levels">
                                                                    <a
                                                                        aria-label="Learn more about levels"
                                                                        title="Learn more about levels"
                                                                        className="text-black hover:text-blue-700 ml-1 text-xs bg-blue-200 px-1 rounded-full">
                                                                        ?
                                                                    </a>
                                                                </Link>
                                                            </span>
                                                            <span className="bg-gray-200 px-1 rounded float-right">
                                                                2
                                                            </span>
                                                        </h3>
                                                        <div className="w-full my-2">
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-500">
                                                                    175
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    250
                                                                </p>
                                                            </div>
                                                            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`bg-blue-400 h-full`}
                                                                    style={{
                                                                        width: `50%`,
                                                                    }}></div>
                                                            </div>
                                                        </div>
                                                        <p className="mt-2 font-bold text-gray-500">
                                                            75 points left to
                                                            level 3
                                                        </p>
                                                        <div className="flex flex-col xl:flex-row gap-2 mt-2">
                                                            <div className="w-full bg-green-300 rounded flex flex-col p-2 gap-1">
                                                                <h4 className="text-green-700 font-bold">
                                                                    Next reward
                                                                    points
                                                                </h4>
                                                                <p className="text-lg ml-auto mt-auto text-right">
                                                                    61
                                                                </p>
                                                            </div>
                                                            <div className="w-full bg-blue-300 rounded flex flex-col p-2 gap-1">
                                                                <h4 className="text-blue-700 font-bold">
                                                                    Last update
                                                                </h4>
                                                                <p className="text-lg ml-auto mt-auto text-right">
                                                                    2 hrs ago
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="list-disc list-inside">
                                                <li className="mx-2">
                                                    Progress bar shows the
                                                    user's current progress to
                                                    the next level.
                                                </li>
                                                <li className="mx-2">
                                                    Green box shows the amount
                                                    of points a user will
                                                    receive if they create a
                                                    post at that time.
                                                </li>
                                                <li className="mx-2">
                                                    Blue box shows the last
                                                    update of the user's points.
                                                    If there are no updates for
                                                    more than 24 hours the user
                                                    loses a level.
                                                </li>
                                            </ul>
                                        </div>
                                        <h2 className="font-bold text-lg mt-2">
                                            Levels & Rewards
                                        </h2>
                                        <ul className="list-disc list-inside">
                                            <li className="font-bold">
                                                Level 1 (Default)
                                            </li>
                                            <li className="ml-5">
                                                + 1 reaction (Like)
                                            </li>
                                            <li className="ml-5">
                                                Gray profile frame
                                            </li>
                                            <li className="font-bold mt-3">
                                                Level 2
                                            </li>
                                            <li className="ml-5">
                                                + 1 reaction (Star)
                                            </li>
                                            <li className="ml-5">
                                                Blue profile frame
                                            </li>
                                            <li className="font-bold mt-3">
                                                Level 3
                                            </li>
                                            <li className="ml-5">
                                                + 1 reaction (Heart)
                                            </li>
                                            <li className="ml-5">
                                                Yellow profile frame
                                            </li>
                                            <li className="font-bold mt-3">
                                                Level 4
                                            </li>
                                            <li className="ml-5">
                                                Ability to add details to posts
                                            </li>
                                            <li className="ml-5">
                                                Green profile frame
                                            </li>
                                            <li className="font-bold mt-3">
                                                Level 5
                                            </li>
                                            <li className="ml-5">
                                                + 1 reaction (Dislike)
                                            </li>
                                            <li className="ml-5">
                                                Red profile frame
                                            </li>
                                        </ul>
                                    </div>
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
