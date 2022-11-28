import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import PostCard from '@/components/PostCard'

export default function Home() {
    const { user } = useAuth({ middleware: 'auth' })
    const [posts, setPosts] = useState([])
    useEffect(() => {
        axios
            .get(`/api/get-posts`)
            .then(results => {
                setPosts(results.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Home">
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-3">
                            {posts.map(post => (
                                <PostCard
                                    user={user}
                                    post={post}
                                    key={`post-key-${post.id}`}
                                />
                            ))}
                        </div>
                    </div>
                </AppLayout>
            ) : (
                <LoadingScreen />
            )}
        </>
    )
}
