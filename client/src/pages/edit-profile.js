import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import Button from '@/components/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AlertCard from '@/components/AlertCard'

export default function EditProfile() {
    const { user } = useAuth({ middleware: 'auth' })
    const [createdAt, setCreatedAt] = useState()
    const dateCollectionDisabled =
        process.env.NEXT_PUBLIC_DISABLE_DATA_COLLECTION === 'true'
    useEffect(() => {
        if (user) {
            const date = new Date(user.created_at)
            setCreatedAt(
                date.toLocaleString('default', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            )
        }
    }, [user])
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Edit Profile">
                    <div className="py-12">
                        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                            {dateCollectionDisabled && (
                                <AlertCard
                                    className="mb-5"
                                    type="warning"
                                    title={'Warning'}>
                                    Some or all of the functionality on this
                                    page may be disabled during the testing
                                    period of the website.
                                </AlertCard>
                            )}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h1 className="mb-2">Profile Settings</h1>
                                    <div className="flex justify-between items-center p-5 border">
                                        <div>
                                            <p className="font-bold">Name:</p>
                                            <p>{user.name}</p>
                                        </div>
                                        <Button
                                            disabled={dateCollectionDisabled}>
                                            Update
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-center p-5 border">
                                        <div>
                                            <p className="font-bold">Email:</p>
                                            <p>{user.email}</p>
                                        </div>
                                        <Button
                                            disabled={dateCollectionDisabled}>
                                            Update
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-center p-5 border">
                                        <div>
                                            <p className="font-bold">
                                                Password:
                                            </p>
                                            <p>********</p>
                                        </div>
                                        <Button
                                            disabled={dateCollectionDisabled}>
                                            Update
                                        </Button>
                                    </div>
                                    <div className="flex mt-3">
                                        <div className="flex flex-col justify-center">
                                            <p className="font-bold">
                                                Created:
                                            </p>
                                            <p>{createdAt}</p>
                                        </div>
                                        <div className="flex justify-center items-center gap-3 ml-auto">
                                            <Link href={`/user/${user.slug}`}>
                                                <a className="underline text-gray-600 hover:text-gray-900">
                                                    Back
                                                </a>
                                            </Link>
                                            <Button
                                                className=""
                                                color="danger"
                                                disabled={
                                                    dateCollectionDisabled
                                                }>
                                                Delete
                                            </Button>
                                        </div>
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
