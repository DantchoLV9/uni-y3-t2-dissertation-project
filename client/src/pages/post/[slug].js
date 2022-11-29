import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import PostCard from '@/components/PostCard'

const PostPage = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const slug = router.query.slug
    const [post, setPost] = useState()
    useEffect(async () => {
        if (slug !== undefined) {
            axios
                .get(`/api/get-post?slug=${slug}`)
                .then(result => {
                    setPost(result.data)
                })
                .catch(error => {
                    console.log(error)
                    router.push('/404')
                })
        }
    }, [slug])
    return (
        <>
            {user && post ? (
                <AppLayout pageTitle={post.title}>
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                            <PostCard user={user} post={post} page={true} />
                        </div>
                    </div>
                </AppLayout>
            ) : (
                <LoadingScreen />
            )}
        </>
    )
}

export default PostPage
