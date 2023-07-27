import cameraImage from '../images/camera.jpg'
import AlertCard from './AlertCard'

const AuthCard = ({ logo, displayDisabledMsg, children }) => {
    const dateCollectionDisabled =
        process.env.NEXT_PUBLIC_DISABLE_DATA_COLLECTION === 'true'
    return (
        <>
            {/* Disabled cool background image during data collection */}
            <div className="absolute top-0 left-0 w-full h-full bg-no-repeat -z-10 flex overflow-hidden">
                <img
                    className="w-2/5 h-full object-cover hidden sm:inline-block"
                    src={cameraImage.src}
                />
                <div className="sm:left-1/3 sm:-skew-x-6 absolute w-full h-full overflow-hidden bg-gray-100 shadow-2xl"></div>
            </div>
            {/* This is the temp variant of the background (Delete after switching back to image) */}
            {/* <div className="absolute top-0 left-0 w-full h-full bg-no-repeat -z-10 flex overflow-hidden">
                <div className="absolute w-full h-full overflow-hidden bg-gray-100 shadow-2xl"></div>
            </div> */}
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
                <div>{logo}</div>

                {dateCollectionDisabled && displayDisabledMsg && (
                    <AlertCard
                        className="sm:max-w-md"
                        type="warning"
                        title={'Warning'}>
                        Some or all of the functionality on this page may be
                        disabled during the testing period of the website.
                    </AlertCard>
                )}

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </>
    )
}

export default AuthCard
