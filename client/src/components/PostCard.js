import CommentIcon from '@/images/commentIcon'
import LikeIcon from '@/images/likeIcon'
import OptionsIcon from '@/images/optionsIcon'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Popup from 'reactjs-popup'
import axios from '@/lib/axios'
import Button from './Button'
import { useRouter } from 'next/router'

const PostCard = ({ user, post, page = false }) => {
    const router = useRouter()
    const optionsPopUp = useRef()
    const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const [createdAt, setCreatedAt] = useState()
    const [likeButtonText, setLikeButtonText] = useState('Like')
    const [likeButtonApiUrl, setLikeButtonApiUrl] = useState(
        '/api/like-post?id=',
    )
    const [likeLoading, setLikeLoading] = useState(false)
    const [postContent, setPostContent] = useState(post)
    const [postDeleted, setPostDeleted] = useState(false)
    useEffect(() => {
        if (user) {
            const date = new Date(post.created_at)
            setCreatedAt(
                date.toLocaleString('default', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            )
        }
    }, [user])
    const handleLikeButton = () => {
        setLikeLoading(true)
        axios
            .get(`${likeButtonApiUrl}${post.id}`)
            .then(results => {
                setPostContent(results.data)
                setLikeLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }
    useEffect(() => {
        if (postContent.liked) {
            setLikeButtonText('Unlike')
            setLikeButtonApiUrl('/api/unlike-post?id=')
        }
        if (!postContent.liked) {
            setLikeButtonText('Like')
            setLikeButtonApiUrl('/api/like-post?id=')
        }
    }, [postContent])
    const handlePostDeleteButton = () => {
        axios
            .get(`/api/delete-post?id=${post.id}`)
            .then(results => {
                if (results.status === 200) {
                    if (page) {
                        router.push(`/user/${user.slug}`)
                    }
                    setPostDeleted(true)
                    optionsPopUp.current.close()
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <>
            <div
                className={`bg-white overflow-hidden shadow-sm sm:rounded-lg ${
                    postDeleted && 'hidden'
                }`}>
                <div className=" bg-white border-b border-gray-200 flex flex-col">
                    <div className="p-6 flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-3">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-6 w-6 fill-current text-gray-400"
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
                            <Link href={`/user/${postContent.created_by.slug}`}>
                                <a className="text-gray-600 hover:text-gray-900">
                                    {postContent.created_by.name}
                                </a>
                            </Link>
                        </div>
                        <Popup
                            ref={optionsPopUp}
                            nested
                            trigger={
                                <button
                                    aria-label="options menu"
                                    className="flex flex-row gap-2 justify-center items-center transition duration-150 ease-in-out hover:bg-gray-200 text-gray-800 rounded-full font-bold">
                                    <OptionsIcon />
                                </button>
                            }
                            position={['right top', 'left top']}
                            closeOnDocumentClick
                            keepTooltipInside=".tooltipBoundary">
                            {close => (
                                <div className="flex flex-col justify-center py-1 w-48 bg-white overflow-hidden shadow-xl rounded-lg gap-1">
                                    {!page && (
                                        <Link
                                            href={`/post/${postContent.slug}`}>
                                            <a className="p-3 hover:bg-gray-100 text-gray-800 transition duration-150 ease-in-out">
                                                Go to Post
                                            </a>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${process.env.NEXT_PUBLIC_FRONTEND_URL}/post/${postContent.slug}`,
                                            )
                                            close()
                                        }}
                                        className="p-3 text-left hover:bg-gray-100 text-gray-800 transition duration-150 ease-in-out">
                                        Copy link
                                    </button>
                                    {user.id === postContent.created_by.id && (
                                        <Popup
                                            overlayStyle={{
                                                background: 'rgba(0,0,0,0.50)',
                                            }}
                                            trigger={
                                                <button className="p-3 text-left hover:bg-gray-100 text-gray-800 transition duration-150 ease-in-out">
                                                    Delete Post
                                                </button>
                                            }
                                            modal>
                                            {close => (
                                                <div className="flex flex-col justify-center p-5 bg-white overflow-hidden shadow-xl rounded-lg gap-5">
                                                    <p>
                                                        Are you sure that you
                                                        want to delete this
                                                        post?
                                                    </p>
                                                    <div className="flex justify-around items-center w-full">
                                                        <Button
                                                            onClick={() => {
                                                                close()
                                                            }}
                                                            color="success">
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                handlePostDeleteButton()
                                                                close()
                                                            }}
                                                            color="danger">
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                    )}
                                    <button
                                        onClick={() => {
                                            close()
                                        }}
                                        className="p-3 text-left hover:bg-gray-100 text-gray-800 transition duration-150 ease-in-out">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </Popup>
                    </div>
                    <div className="overflow-hidden">
                        {page ? (
                            <img
                                src={`${serverUrl}/user_uploads/${postContent.image}`}
                            />
                        ) : (
                            <Link href={`/post/${postContent.slug}`}>
                                <a target="_blank" title="Open in new tab">
                                    <img
                                        src={`${serverUrl}/user_uploads/${postContent.image}`}
                                    />
                                </a>
                            </Link>
                        )}
                    </div>
                    <div className="p-6 flex flex-col justify-between gap-3">
                        <p className="font-bold">{postContent.title}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-500">
                                {createdAt}
                            </p>
                            <div className="text-gray-500 font-bold flex items-center justify-center gap-3">
                                <p>
                                    {postContent.likes}{' '}
                                    {postContent.likes === 1 ? 'Like' : 'Likes'}
                                </p>
                                <p>{postContent.comments} Comments</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-around items-center">
                            <button
                                disabled={likeLoading}
                                onClick={handleLikeButton}
                                className={`flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 hover:text-rose-600 py-2 rounded font-bold transition duration-150 ease-in-out ${
                                    likeLoading && 'opacity-50'
                                }`}>
                                <LikeIcon /> {likeButtonText}
                            </button>
                            <button className="flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 hover:text-sky-600 py-2 rounded font-bold transition duration-150 ease-in-out">
                                <CommentIcon /> Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostCard
