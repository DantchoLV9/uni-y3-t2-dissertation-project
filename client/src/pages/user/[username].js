import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Button from '@/components/Button'

const UserProfilePage = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const slug = router.query.username
    const [userProfile, setUserProfile] = useState({})
    useEffect(async () => {
        if (slug !== undefined) {
            axios
                .get(`/api/user-profile-from-slug?slug=${slug}`)
                .then(result => {
                    setUserProfile(result.data)
                })
                .catch(error => {
                    console.log(error)
                    router.push('/')
                    return
                })
        }
    }, [slug])
    return (
        <>
            {user ? (
                <AppLayout pageTitle={`${user.name}'s Profile`}>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="w-3/4"></div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-1/4 ml-auto">
                                <div className="p-6 bg-white border-b border-gray-200 flex flex-col gap-3 justify-center items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-20 w-20 fill-current text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="w-full flex flex-col gap-3">
                                        <p className="text-gray-800 font-bold text-2xl text-center">
                                            {userProfile.name}
                                        </p>
                                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                                        <div className="flex justify-around items-center">
                                            <div className="flex flex-col justify-center items-center">
                                                <p className="font-bold text-xl text-gray-500">
                                                    Followers
                                                </p>
                                                <p className="text-2xl">0</p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center">
                                                <p className="font-bold text-xl text-gray-500">
                                                    Posts
                                                </p>
                                                <p className="text-2xl">0</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            {userProfile.id === user.id ? (
                                                <Button>Edit Profile</Button>
                                            ) : (
                                                <Button>Follow</Button>
                                            )}
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

export default UserProfilePage
