import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import Dropzone from 'react-dropzone'
import { useEffect, useState } from 'react'
import AlertCard from '@/components/AlertCard'
import Label from '@/components/Label'
import InputError from '@/components/InputError'
import Input from '@/components/Input'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()
    const { user } = useAuth({ middleware: 'auth' })
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [showSecondStage, setShowSecondStage] = useState(false)
    const [fileDropError, setFileDropError] = useState(false)
    const [postTitle, setPostTitle] = useState('')
    const [errors, setErrors] = useState([])
    const submitForm = async e => {
        e.preventDefault()
        setErrors([])
        const formData = new FormData()
        formData.append('title', postTitle)
        formData.append('image', images[0])
        axios
            .post('/api/create-post', formData)
            .then(result => {
                if (result.status === 201) {
                    router.push(`/post/${result.data.slug}`)
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }
    const handleCancelButton = () => {
        setImages([])
        setImagePreviews([])
        setShowSecondStage(false)
        setFileDropError(false)
        setPostTitle('')
    }
    const handleFileUpload = files => {
        setImages(files)
    }
    // Show image error message from server
    useEffect(() => {
        if ('image' in errors) {
            setShowSecondStage(false)
            setFileDropError(true)
        }
    }, [errors])
    // Create image previews
    useEffect(() => {
        if (images.length > 0) {
            setFileDropError(false)
            setImagePreviews(
                images.map(image => {
                    return URL.createObjectURL(image)
                }),
            )
            setShowSecondStage(true)
        }
    }, [images])
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Upload">
                    <div className="py-12">
                        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h1 className="text-xl font-bold mb-3">
                                        {showSecondStage
                                            ? `Post Details`
                                            : `Upload Image`}
                                    </h1>
                                    {showSecondStage ? (
                                        <div>
                                            <form
                                                onSubmit={submitForm}
                                                className="flex flex-col gap-3">
                                                <div>
                                                    <Label
                                                        className=""
                                                        htmlFor="postTitle">
                                                        Post Title
                                                    </Label>
                                                    <Input
                                                        id="postTitle"
                                                        type="text"
                                                        className="block mt-1 w-full"
                                                        autoFocus
                                                        required
                                                        value={postTitle}
                                                        onChange={e => {
                                                            setPostTitle(
                                                                e.target.value,
                                                            )
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.title}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <Button
                                                        type="button"
                                                        color="danger"
                                                        onClick={
                                                            handleCancelButton
                                                        }>
                                                        Cancel
                                                    </Button>
                                                    <Button color="success">
                                                        Upload
                                                    </Button>
                                                </div>
                                                <div className="w-full h-1 bg-gray-200 rounded"></div>
                                                <h2 className="font-bold">
                                                    Image Preview
                                                </h2>
                                                <div>
                                                    {imagePreviews.map(
                                                        (image, i) => (
                                                            <img
                                                                className="rounded w-full object-cover"
                                                                key={`preview-${i}`}
                                                                alt="preview"
                                                                src={image}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <>
                                            {fileDropError && (
                                                <AlertCard
                                                    title="Error"
                                                    type="danger"
                                                    dismissible
                                                    className="mb-3">
                                                    Currently you can only
                                                    upload a single image file
                                                    (maximum 10MB) per post.
                                                    Please try again!
                                                </AlertCard>
                                            )}
                                            <Dropzone
                                                multiple={false}
                                                onDropRejected={() =>
                                                    setFileDropError(true)
                                                }
                                                onDrop={acceptedFiles =>
                                                    handleFileUpload(
                                                        acceptedFiles,
                                                    )
                                                }
                                                accept={{
                                                    'image/png': [],
                                                    'image/jpeg': [],
                                                }}
                                                maxFiles={1}>
                                                {({
                                                    getRootProps,
                                                    getInputProps,
                                                    isDragActive,
                                                }) => (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="dropzone-file"
                                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                            {...getRootProps()}>
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    aria-hidden="true"
                                                                    className="w-10 h-10 mb-3 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                                                    />
                                                                </svg>
                                                                <p className="mb-2 text-gray-500">
                                                                    {isDragActive ? (
                                                                        <>
                                                                            Drop
                                                                            files
                                                                            here
                                                                            ...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="font-bold">
                                                                                Click
                                                                                to
                                                                                upload
                                                                            </span>{' '}
                                                                            or
                                                                            drag
                                                                            and
                                                                            drop
                                                                        </>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    PNG or JPG
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/png, image/jpeg"
                                                                {...getInputProps()}
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </>
                                    )}
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
