import CommentIcon from '@/images/commentIcon'
import LikeIcon from '@/images/likeIcon'
import OptionsIcon from '@/images/optionsIcon'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Button from './Button'

const PostCard = ({ user, post }) => {
    const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const [createdAt, setCreatedAt] = useState()
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
    console.log(post)
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
                            <Link href={`user/${post.created_by.slug}`}>
                                <a className="text-gray-600 hover:text-gray-900">
                                    {post.created_by.name}
                                </a>
                            </Link>
                        </div>
                        {user.id !== post.created_by.id ? (
                            <Button color="primary">Follow</Button>
                        ) : (
                            <button className="flex flex-row gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 rounded-full font-bold">
                                <OptionsIcon />
                            </button>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <Link href={`/post/${post.slug}`}>
                            <a target="_blank" title="Open in new tab">
                                <img
                                    src={`${serverUrl}/user_uploads/${post.image}`}
                                />
                            </a>
                        </Link>
                    </div>
                    <div className="p-6 flex flex-col justify-between gap-3">
                        <p className="font-bold">{post.title}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-500">
                                {createdAt}
                            </p>
                            <div className="text-gray-500 font-bold flex items-center justify-center gap-3">
                                <p>0 Likes</p>
                                <p>0 Comments</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-around items-center">
                            <button className="flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-200 text-gray-800 py-2 rounded font-bold">
                                <LikeIcon /> Like
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
