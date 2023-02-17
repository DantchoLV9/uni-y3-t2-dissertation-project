import CommentIcon from '@/images/commentIcon'
import LikeIcon from '@/images/likeIcon'
import UnlikeIcon from '@/images/unlikeIcon'
import HeartIcon from '@/images/heartIcon'
import StarIcon from '@/images/starIcon'
import OptionsIcon from '@/images/optionsIcon'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Popup from 'reactjs-popup'
import axios from '@/lib/axios'
import Button from './Button'
import { useRouter } from 'next/router'
import Label from './Label'
import TextArea from './TextArea'
import InputError from './InputError'
import PostComment from './PostComment'
import levelColors from '../lib/levelColors'
import PlusIcon from '@/images/plusIcon'
import ReactionsList from './ReactionsList'
import CrossIcon from '@/images/crossIcon'

const PostCard = ({ user, post, page = false }) => {
    const router = useRouter()
    const optionsPopUp = useRef()
    const reactionsMenu = useRef()
    const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const [createdAt, setCreatedAt] = useState()
    const [likeButtonText, setLikeButtonText] = useState('Like')
    const [likeButtonIcon, setLikeButtonIcon] = useState(LikeIcon)
    const [likeButtonColor, setLikeButtonColor] = useState('text-violet-600')
    const [likeButtonApiUrl, setLikeButtonApiUrl] = useState(
        '/api/react-post?id=',
    )
    const [likeLoading, setLikeLoading] = useState(false)
    const [postContent, setPostContent] = useState(post)
    const [postDeleted, setPostDeleted] = useState(false)
    const [commentsSectionOpen, setCommentsSectionOpen] = useState(false)
    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState([])
    const [comments, setComments] = useState([])
    const [commentPostingLoading, setCommentPostingLoading] = useState(false)
    const [currentLevelColor, setCurrentLevelColor] = useState('gray-200')

    // Transform date into nice format
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
    // Handle the like/unlike button functionality
    const handleReactionButton = reactionType => {
        reactionsMenu.current.close()
        setLikeLoading(true)
        axios
            .get(`${likeButtonApiUrl}${post.id}&reaction=${reactionType}`)
            .then(results => {
                setPostContent(results.data)
                setLikeLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }
    // Helps with the like/unlike button API calls & button text changes
    useEffect(() => {
        if (postContent.reacted) {
            switch (postContent.reacted.reaction_type) {
                case 0:
                    setLikeButtonText('Unlike')
                    setLikeButtonIcon(LikeIcon)
                    setLikeButtonColor('text-violet-600')
                    break
                case 1:
                    setLikeButtonText('Unstar')
                    setLikeButtonIcon(StarIcon)
                    setLikeButtonColor('text-yellow-600')
                    break
                case 2:
                    setLikeButtonText('Unheart')
                    setLikeButtonIcon(HeartIcon)
                    setLikeButtonColor('text-pink-600')
                    break
                case 3:
                    setLikeButtonText('Undislike')
                    setLikeButtonIcon(UnlikeIcon)
                    setLikeButtonColor('text-red-600')
                    break
            }
            setLikeButtonApiUrl('/api/unreact-post?id=')
        }
        if (!postContent.reacted) {
            setLikeButtonText('Like')
            setLikeButtonIcon(LikeIcon)
            setLikeButtonColor('text-violet-600')
            setLikeButtonApiUrl('/api/react-post?id=')
        }
        if (postContent) {
            setCurrentLevelColor(
                levelColors.filter(
                    item => parseInt(item.level) === postContent.creator_level,
                )[0]?.color,
            )
        }
    }, [postContent])
    // Handle the post delete button
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
    // Handle the add comment button
    const handleAddComment = e => {
        e.preventDefault()
        setErrors([])
        const formData = new FormData()
        formData.append('comment', comment)
        formData.append('parent_post', postContent.id)
        setCommentPostingLoading(true)
        axios
            .post('/api/create-comment', formData)
            .then(result => {
                setCommentPostingLoading(false)
                console.log(result)
                getPostComments()
                setComment('')
                updatePostData(postContent.id)
            })
            .catch(error => {
                setCommentPostingLoading(false)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }
    useEffect(() => {
        getPostComments()
    }, [commentsSectionOpen])
    const getPostComments = () => {
        if (commentsSectionOpen) {
            axios
                .get(`/api/get-post-comments-by-id?id=${postContent.id}`)
                .then(results => {
                    console.log(results)
                    setComments(results.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const updatePostData = postId => {
        axios
            .get(`/api/get-post-from-id?id=${postId}`)
            .then(results => {
                setPostContent(results.data)
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
                            <div
                                className={`flex-shrink-0 border-2 border-${currentLevelColor} rounded-full p-1.5`}>
                                <svg
                                    className="h-6 w-6 fill-current text-gray-600"
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
                                    className="flex flex-row gap-2 justify-center items-center transition duration-150 ease-in-out hover:bg-gray-100 text-gray-800 rounded-full font-bold">
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
                                        Copy Link
                                    </button>
                                    <a
                                        href={`${serverUrl}/user_uploads/${postContent.image}`}
                                        target="_blank"
                                        className="p-3 hover:bg-gray-100 text-gray-800 transition duration-150 ease-in-out">
                                        Open Original
                                    </a>
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
                                src={`${serverUrl}/user_uploads/${postContent.scrollFeedImg}`}
                            />
                        ) : (
                            <Link href={`/post/${postContent.slug}`}>
                                <a target="_blank" title="Open in new tab">
                                    <img
                                        loading="lazy"
                                        src={`${serverUrl}/user_uploads/${postContent.scrollFeedImg}`}
                                    />
                                </a>
                            </Link>
                        )}
                    </div>
                    <div className="p-6 flex flex-col justify-between gap-3">
                        <p className="font-bold text-gray-800">
                            {postContent.title}
                        </p>
                        <div className="flex items-center justify-between flex-col gap-2 sm:gap-0 sm:flex-row">
                            <p className="text-sm font-bold text-gray-500 self-start sm:self-center">
                                {createdAt}
                            </p>
                            <div className="text-gray-500 font-bold flex items-center justify-start sm:justify-center gap-3 w-full sm:w-auto">
                                <Popup
                                    overlayStyle={{
                                        background: 'rgba(0,0,0,0.50)',
                                    }}
                                    trigger={
                                        <p className="cursor-pointer">
                                            {postContent.likes}{' '}
                                            {postContent.likes === 1
                                                ? 'Reaction'
                                                : 'Reactions'}
                                        </p>
                                    }
                                    modal>
                                    {close => (
                                        <div className="flex flex-col justify-center p-5 bg-white overflow-hidden shadow-xl rounded-lg">
                                            <ReactionsList
                                                post={postContent}
                                                close={close}
                                            />
                                        </div>
                                    )}
                                </Popup>
                                <p
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setCommentsSectionOpen(
                                            !commentsSectionOpen,
                                        )
                                    }>
                                    {postContent.comments} Comments
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex justify-around items-center">
                            <button
                                disabled={likeLoading}
                                onClick={() => handleReactionButton(0)}
                                className={`flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-100 text-gray-800 hover:${likeButtonColor} py-2 rounded font-bold transition duration-150 ease-in-out ${
                                    likeLoading && 'opacity-50'
                                }`}>
                                {likeButtonIcon} {likeButtonText}
                            </button>
                            <Popup
                                trigger={
                                    <button
                                        disabled={
                                            likeLoading || postContent.reacted
                                        }
                                        aria-label="reactions menu"
                                        title={
                                            postContent.reacted
                                                ? 'already reacted'
                                                : 'reactions menu'
                                        }
                                        className={`flex flex-row w-full flex-1 gap-2 justify-center items-center  text-gray-800  p-2 rounded font-bold transition duration-150 ease-in-out ${
                                            likeLoading || postContent.reacted
                                                ? 'opacity-50'
                                                : 'hover:bg-gray-100 hover:text-green-600'
                                        }`}>
                                        <PlusIcon />
                                    </button>
                                }
                                ref={reactionsMenu}
                                position="top center"
                                closeOnDocumentClick
                                keepTooltipInside=".tooltipBoundary">
                                <div className="flex flex-row justify-center w-48 bg-white overflow-hidden shadow rounded-lg gap-1">
                                    <button
                                        aria-label="star"
                                        title="star"
                                        disabled={likeLoading}
                                        onClick={() => handleReactionButton(1)}
                                        className={`outline-none flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-100 text-yellow-800 hover:text-yellow-600 p-2 rounded font-bold transition duration-150 ease-in-out ${
                                            likeLoading && 'opacity-50'
                                        }`}>
                                        <StarIcon />
                                    </button>
                                    <button
                                        aria-label="heart"
                                        title="heart"
                                        disabled={likeLoading}
                                        onClick={() => handleReactionButton(2)}
                                        className={`outline-none flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-100 text-pink-800 hover:text-pink-600 p-2 rounded font-bold transition duration-150 ease-in-out ${
                                            likeLoading && 'opacity-50'
                                        }`}>
                                        <HeartIcon />
                                    </button>
                                    <button
                                        aria-label="dislike"
                                        title="dislike"
                                        disabled={likeLoading}
                                        onClick={() => handleReactionButton(3)}
                                        className={`outline-none flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-100 text-red-800 hover:text-red-600 p-2 rounded font-bold transition duration-150 ease-in-out ${
                                            likeLoading && 'opacity-50'
                                        }`}>
                                        <UnlikeIcon />
                                    </button>
                                </div>
                            </Popup>
                            <button
                                onClick={() =>
                                    setCommentsSectionOpen(!commentsSectionOpen)
                                }
                                className="flex flex-row w-full gap-2 justify-center items-center hover:bg-gray-100 text-gray-800 hover:text-blue-500 py-2 rounded font-bold transition duration-150 ease-in-out">
                                <CommentIcon /> Comment
                            </button>
                        </div>
                    </div>
                    {commentsSectionOpen && (
                        <div className="p-6 flex flex-col justify-between gap-3 border-t-2">
                            <form
                                onSubmit={handleAddComment}
                                className="flex flex-col justify-center">
                                <Label htmlFor="comment">
                                    Add your comment
                                </Label>
                                <TextArea
                                    value={comment}
                                    onChange={e => {
                                        setComment(e.target.value)
                                    }}
                                    id="comment"
                                    type="text"
                                    className="block mt-1 w-full"
                                />
                                <InputError
                                    messages={errors.comment}
                                    className="mt-2"
                                />
                                <div className="flex self-end justify-center items-center mt-3">
                                    {commentPostingLoading && (
                                        <div role="status">
                                            <svg
                                                className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                            <span className="sr-only">
                                                Loading...
                                            </span>
                                        </div>
                                    )}
                                    <Button disabled={commentPostingLoading}>
                                        Comment
                                    </Button>
                                </div>
                            </form>
                            <div className="flex flex-col justify-center items-start gap-8">
                                {comments.map(comment => {
                                    return (
                                        <PostComment
                                            key={`post-comment-key-${comment.id}`}
                                            post={postContent}
                                            updatePostData={updatePostData}
                                            getPostComments={getPostComments}
                                            user={user}
                                            comment={comment}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PostCard
