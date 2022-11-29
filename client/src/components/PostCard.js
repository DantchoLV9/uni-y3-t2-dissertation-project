import CommentIcon from '@/images/commentIcon'
import LikeIcon from '@/images/likeIcon'
import OptionsIcon from '@/images/optionsIcon'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Button from './Button'
import axios from '@/lib/axios'

const PostCard = ({ user, post, page = false }) => {
    const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const [createdAt, setCreatedAt] = useState()
    const [likeButtonText, setLikeButtonText] = useState('Like')
    const [likeButtonApiUrl, setLikeButtonApiUrl] = useState(
        '/api/like-post?id=',
    )
    const [likeLoading, setLikeLoading] = useState(false)
    const [postContent, setPostContent] = useState(post)
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
    return (
        <>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
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
                        {user.id !== postContent.created_by.id ? (
                            <Button color="primary">Follow</Button>
                        ) : (
                            <button className="flex flex-row gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 rounded-full font-bold">
                                <OptionsIcon />
                            </button>
                        )}
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
                                className={`flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 py-2 rounded font-bold ${
                                    likeLoading && 'opacity-50'
                                }`}>
                                <LikeIcon /> {likeButtonText}
                            </button>
                            <button className="flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 py-2 rounded font-bold">
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
