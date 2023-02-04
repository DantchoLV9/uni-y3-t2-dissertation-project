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
    const [unexpectedError, setUnexpectedError] = useState(false)
    const [postTitle, setPostTitle] = useState('')
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const submitForm = async e => {
        e.preventDefault()
        setErrors([])
        const formData = new FormData()
        formData.append('title', postTitle)
        formData.append('image', images[0])
        setLoading(true)
        setUnexpectedError(false)
        axios
            .post('/api/create-post', formData)
            .then(result => {
                setLoading(false)
                if (result.status === 201) {
                    router.push(`/post/${result.data.slug}`)
                }
            })
            .catch(error => {
                setLoading(false)
                if (error.response?.status !== 422) {
                    setUnexpectedError(true)
                }else {
                    setErrors(error.response.data.errors)
                }
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
                            {unexpectedError &&
                            <AlertCard
                                title="Oh no"
                                type="danger"
                                dismissible
                                className="mb-3"
                                dismissedCallback={() => setUnexpectedError(false)}
                                >
                                Something unexpected went wrong. Please try again in a few minutes! If the issue persists contact the website administrator!
                            </AlertCard>
                            }
                            {showSecondStage && loading ? 
                            <AlertCard
                                title="Hey there!"
                                type="info"
                                dismissible
                                className="mb-3">
                                Please be patient when uploading large images! Currently processing can take up to 2 minutes depending on the size of the image.
                            </AlertCard> : ""}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h1 className="text-xl font-bold mb-3">
                                        {showSecondStage
                                            ? `Post Details`
                                            : `Upload Image`}
                                    </h1>
                                    {showSecondStage ? (
                                        <div className="flex flex-col gap-3">
                                            <form
                                                onSubmit={submitForm}
                                                className="relative">
                                                <div className="flex flex-col gap-3">
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
                                                            disabled={loading}
                                                            value={postTitle}
                                                            required
                                                            onChange={e => {
                                                                setPostTitle(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }}
                                                        />
                                                        <InputError
                                                            messages={
                                                                errors.title
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div className="w-full flex justify-between items-center">
                                                        <Button
                                                            type="button"
                                                            color="danger"
                                                            disabled={loading}
                                                            onClick={
                                                                handleCancelButton
                                                            }>
                                                            Cancel
                                                        </Button>
                                                        <div className="flex flex-row justify-center items-center gap-1">
                                                            {loading && (
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
                                                            <Button
                                                                color="success"
                                                                disabled={
                                                                    loading
                                                                }>
                                                                Upload
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            <div className="w-full h-1 bg-gray-200 rounded"></div>
                                            <div className="flex flex-col gap-3">
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
                                            </div>
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
                                                                <p className="mb-2 text-gray-500 text-center">
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
