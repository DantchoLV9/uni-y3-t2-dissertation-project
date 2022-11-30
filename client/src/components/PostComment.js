import LikeIcon from '@/images/likeIcon'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from '@/lib/axios'
import Popup from 'reactjs-popup'
import Button from './Button'

const PostComment = ({
    post,
    updatePostData,
    getPostComments,
    user,
    comment,
}) => {
    const [commentData, setCommentData] = useState(comment)
    const [commentDeleted, setCommentDeleted] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)
    const [likeButtonText, setLikeButtonText] = useState('Like')
    const [likeButtonApiUrl, setLikeButtonApiUrl] = useState(
        '/api/like-comment?id=',
    )
    const handleCommentDelete = () => {
        axios
            .get(`/api/delete-comment?id=${comment.id}`)
            .then(results => {
                console.log(results)
                if (results.status === 200) {
                    setCommentDeleted(true)
                    getPostComments()
                    updatePostData(post.id)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    const handleLikeButton = () => {
        setLikeLoading(true)
        axios
            .get(`${likeButtonApiUrl}${comment.id}`)
            .then(results => {
                setCommentData(results.data)
                setLikeLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }
    useEffect(() => {
        if (commentData.liked) {
            setLikeButtonText('Unlike')
            setLikeButtonApiUrl('/api/unlike-comment?id=')
        }
        if (!commentData.liked) {
            setLikeButtonText('Like')
            setLikeButtonApiUrl('/api/like-comment?id=')
        }
    }, [commentData])
    return (
        <>
            <div
                className={`flex flex-col gap-3 w-full ${
                    commentDeleted && 'hidden'
                }`}>
                <div className="flex gap-1 items-center">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-8 w-8 fill-current text-gray-400"
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
                    <div className="flex w-full justify-between items-center">
                        <Link href={`/user/${commentData.created_by.slug}`}>
                            <a className="font-bold text-lg text-gray-800 hover:underline">
                                {commentData.created_by.name}
                            </a>
                        </Link>
                    </div>
                </div>
                <p className="p-3 px-5 relative text-gray-800 bg-gray-100 rounded-3xl self-start whitespace-pre-line flex justify-center items-center gap-3">
                    {commentData.text}
                    {commentData.likes > 0 && (
                        <span
                            className={`bg-gray-100 text-violet-600 font-bold text-center text rounded-t-2xl flex justify-center items-center gap-1.5 ${
                                commentData.text.length > 25 &&
                                'absolute right-4 -top-6 py-1 px-2'
                            }`}
                            aria-hidden={true}>
                            {commentData.likes} <LikeIcon className="text-xs" />
                        </span>
                    )}
                </p>
                <div className="flex justify-between items-center gap-3">
                    <p className="text-sm font-bold text-gray-500">
                        {new Date(commentData.created_at).toLocaleString(
                            'default',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            },
                        )}
                    </p>
                    <div className="flex justify-between items-center">
                        {commentData.created_by.id === user.id && (
                            <Popup
                                overlayStyle={{
                                    background: 'rgba(0,0,0,0.50)',
                                }}
                                trigger={
                                    <button className="hover:bg-gray-100 text-gray-800 hover:text-red-600 px-2 rounded font-bold transition duration-150 ease-in-out">
                                        Delete
                                    </button>
                                }
                                modal>
                                {close => (
                                    <div className="flex flex-col justify-center p-5 bg-white overflow-hidden shadow-xl rounded-lg gap-5">
                                        <p>
                                            Are you sure that you want to delete
                                            this comment?
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
                                                    handleCommentDelete()
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
                            onClick={handleLikeButton}
                            disabled={likeLoading}
                            className="hover:bg-gray-100 text-gray-800 hover:text-violet-600 px-2 rounded font-bold transition duration-150 ease-in-out">
                            {likeButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostComment
