import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Button from '@/components/Button'
import Link from 'next/link'
import levelColors from '../../lib/levelColors'

const UserProfilePage = () => {
    const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const slug = router.query.slug
    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState(null)
    const [currentLevelColor, setCurrentLevelColor] = useState('gray-200')
    const [currentLevelPercentage, setCurrentLevelPercentage] = useState(0)
    const [followLoading, setFollowLoading] = useState(false)
    const [followButtonApiUrl, setFollowButtonApiUrl] = useState(
        '/api/follow-user?id=',
    )
    const [followButtonText, setFollowButtonText] = useState('Follow')
    useEffect(async () => {
        if (slug !== undefined) {
            axios
                .get(`/api/user-profile-from-slug?slug=${slug}`)
                .then(result => {
                    //console.log(result.data)
                    setUserProfile(result.data)
                })
                .catch(error => {
                    console.log(error)
                    router.push('/404')
                })
        }
    }, [slug])
    useEffect(async () => {
        if (userProfile.id) {
            axios
                .get(`/api/get-posts-by-user-id?id=${userProfile.id}`)
                .then(results => {
                    //console.log(results)
                    //setUserPosts(results.data.data)
                    setUserPosts(results.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
        if (userProfile.streak) {
            // Set the current level color
            setCurrentLevelColor(
                levelColors.filter(
                    item => parseInt(item.level) === userProfile.streak.level,
                )[0].color,
            )
            // Set the current level
            setCurrentLevelPercentage(
                ((userProfile.streak.current_points -
                    userProfile.streak.current_level_points) /
                    (userProfile.streak.next_level_points -
                        userProfile.streak.current_level_points)) *
                    100,
            )
        }
        if (userProfile.follow) {
            setFollowButtonApiUrl('/api/unfollow-user?id=')
            setFollowButtonText('Unfollow')
        } else {
            setFollowButtonApiUrl('/api/follow-user?id=')
            setFollowButtonText('Follow')
        }
    }, [userProfile])
    const editProfileButton = () => {
        router.push('/edit-profile')
    }
    const handleFollow = () => {
        if (userProfile.id) {
            setFollowLoading(true)
            axios
                .get(`${followButtonApiUrl}${userProfile.id}`)
                .then(results => {
                    if (results.data) {
                        axios
                            .get(`/api/user-profile-from-slug?slug=${slug}`)
                            .then(result => {
                                //console.log(result.data)
                                setUserProfile(result.data)
                            })
                            .catch(error => {
                                console.log(error)
                                router.push('/404')
                            })
                    }
                    setFollowLoading(false)
                })
                .catch(error => {
                    console.log(error)
                    setFollowLoading(false)
                })
        }
    }
    return (
        <>
            {user ? (
                <AppLayout pageTitle={`${userProfile.name}'s Profile`}>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col-reverse sm:flex-row justify-center items-start gap-3">
                            <div
                                className={`w-full ${
                                    userPosts?.length > 0 &&
                                    'grid grid-cols-2 lg:grid-cols-3 gap-3'
                                }`}>
                                {userPosts?.length > 0 ? (
                                    userPosts.map(post => {
                                        return (
                                            <Link
                                                key={`postKey-${post.id}`}
                                                href={`/post/${post.slug}`}>
                                                <a className="relative rounded overflow-hidden group">
                                                    <div className="relative after:content-[''] after:block after:pb-100%">
                                                        <img
                                                            loading="lazy"
                                                            className="absolute top-0 bottom-0 left-0 right-0 w-full h-full object-cover object-center"
                                                            src={`${serverUrl}/user_uploads/${post.thumbnail}`}
                                                        />
                                                    </div>
                                                    <div className="w-full h-full absolute top-0 left-0 invisible group-hover:visible bg-black/50 flex flex-col justify-center items-center gap-5 p-5">
                                                        <p className="text-white text-2xl font-bold text-center">
                                                            {`${post.title
                                                                .split(' ')
                                                                .splice(0, 10)
                                                                .join(' ')}${
                                                                post.title.split(
                                                                    ' ',
                                                                ).length > 10
                                                                    ? '...'
                                                                    : ''
                                                            }`}
                                                        </p>
                                                        <div className="flex justify-center items-center">
                                                            <div className="flex flex-col justify-center items-center">
                                                                <p className="text-white text-xl font-bold">
                                                                    Reactions
                                                                </p>
                                                                <p className="text-white text-xl font-bold">
                                                                    {post.likes}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </Link>
                                        )
                                    })
                                ) : (
                                    <div className="w-full">
                                        <h2 className="font-bold text-2xl w-full text-gray-600 text-center">
                                            {userPosts === null
                                                ? 'Loading'
                                                : `No posts by ${userProfile.name} yet`}
                                        </h2>
                                    </div>
                                )}
                            </div>
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w1/4 ml-auto">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full ml-auto">
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
                                            <div className="flex flex-col xl:flex-row justify-around items-center">
                                                <div className="flex flex-row w-full xl:w-auto xl:flex-col justify-between xl:justify-center items-center">
                                                    <p className="font-bold text-xl text-gray-500">
                                                        Followers
                                                    </p>
                                                    <p className="text-2xl">
                                                        {
                                                            userProfile.followers_amount
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex flex-row w-full xl:w-auto xl:flex-col justify-between xl:justify-center items-center">
                                                    <p className="font-bold text-xl text-gray-500">
                                                        Posts
                                                    </p>
                                                    <p className="text-2xl">
                                                        {
                                                            userProfile.posts_amount
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                {userProfile.id === user.id ? (
                                                    <Button
                                                        className="flex justify-center items-center w-full sm:w-auto"
                                                        onClick={
                                                            editProfileButton
                                                        }>
                                                        Edit Profile
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        disabled={followLoading}
                                                        onClick={handleFollow}>
                                                        {followButtonText}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {userProfile &&
                                    user.gamification ? (
                                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full ml-auto mt-5">
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
                                                            {
                                                                userProfile
                                                                    .streak
                                                                    ?.level
                                                            }
                                                        </span>
                                                    </h3>
                                                    <div className="w-full my-2">
                                                        <div className="flex justify-between">
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    userProfile
                                                                        .streak
                                                                        ?.current_points
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {userProfile
                                                                    .streak
                                                                    ?.next_level_points ===
                                                                'maxLevel'
                                                                    ? ''
                                                                    : userProfile
                                                                          .streak
                                                                          ?.next_level_points}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className={`bg-${currentLevelColor} h-full`}
                                                                style={{
                                                                    width: `${
                                                                        userProfile
                                                                            .streak
                                                                            ?.next_level_points ===
                                                                        'maxLevel'
                                                                            ? 100
                                                                            : currentLevelPercentage
                                                                    }%`,
                                                                }}></div>
                                                        </div>
                                                    </div>
                                                    {userProfile.id ===
                                                        user.id && (
                                                        <>
                                                            <p className="mt-2 font-bold text-gray-500">
                                                                {userProfile
                                                                    .streak
                                                                    ?.next_level_points ===
                                                                'maxLevel'
                                                                    ? 'Max level reached'
                                                                    : `${
                                                                          userProfile
                                                                              .streak
                                                                              .next_level_points -
                                                                          userProfile
                                                                              .streak
                                                                              .current_points
                                                                      } points left to level ${
                                                                          userProfile
                                                                              .streak
                                                                              .level +
                                                                          1
                                                                      }`}
                                                            </p>
                                                            {userProfile.streak
                                                                .next_reward_points ||
                                                            userProfile.streak
                                                                .last_upload ? (
                                                                <div className="flex flex-col xl:flex-row gap-2 mt-2">
                                                                    {userProfile
                                                                        .streak
                                                                        .next_reward_points !==
                                                                        null && (
                                                                        <div className="w-full bg-green-300 rounded flex flex-col p-2 gap-1">
                                                                            <h4 className="text-green-700 font-bold">
                                                                                Next
                                                                                reward
                                                                                points
                                                                            </h4>
                                                                            <p className="text-lg ml-auto mt-auto text-right">
                                                                                {
                                                                                    userProfile
                                                                                        .streak
                                                                                        .next_reward_points
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {userProfile
                                                                        .streak
                                                                        .last_upload !==
                                                                        null && (
                                                                        <div className="w-full bg-blue-300 rounded flex flex-col p-2 gap-1">
                                                                            <h4 className="text-blue-700 font-bold">
                                                                                Last
                                                                                update
                                                                            </h4>
                                                                            <p className="text-lg ml-auto mt-auto text-right">
                                                                                {userProfile
                                                                                    .streak
                                                                                    .last_upload ===
                                                                                    0 &&
                                                                                    'Less than 1 hour ago'}
                                                                                {userProfile
                                                                                    .streak
                                                                                    .last_upload >
                                                                                    24 &&
                                                                                    'More than 24 hrs. ago'}
                                                                                {userProfile
                                                                                    .streak
                                                                                    .last_upload >
                                                                                    0 &&
                                                                                userProfile
                                                                                    .streak
                                                                                    .last_upload <
                                                                                    24
                                                                                    ? `${userProfile.streak.last_upload} hrs ago`
                                                                                    : ''}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>,
                                    ) : ""}
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
