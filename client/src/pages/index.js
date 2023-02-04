import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import PostCard from '@/components/PostCard'

export default function Home() {
    const triggerPostRef = useRef();
    const { user } = useAuth({ middleware: 'auth' })
    const [posts, setPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    // Post used to trigger fetch that loads more posts
    const [triggerPost, setTriggerPost] = useState(null);
    useEffect(() => {
        axios
            .get(`/api/get-posts?page=${currentPage}`)
            .then(results => {
                if (currentPage === 1) {
                    setTotalPages(results.data.last_page)
                }
                setPosts((prev) => [...prev, ...results.data.data])
            })
            .catch(error => {
                console.log(error)
            })
    }, [currentPage])
    useEffect(() => {
        if (posts.length) {
            setTriggerPost(posts[posts.length - 5].id)
        }
    }, [posts])
    const loadMoreContent = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }
    useEffect(() => {
        if (triggerPostRef.current) {
            const observer = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    loadMoreContent()
                }
            })
            observer.observe(triggerPostRef.current)
        }
    }, [triggerPost])
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Home">
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-3">
                            {posts && posts.map(post => {
                                return (
                                    <div key={`post-key-${post.id}`}>
                                        {post.id === triggerPost && <div ref={triggerPostRef}></div>}
                                        <PostCard
                                            user={user}
                                            post={post}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </AppLayout>
            ) : (
                <LoadingScreen />
            )}
        </>
    )
}
