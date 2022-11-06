import cameraImage from '../images/camera.jpg'

const AuthCard = ({ logo, children }) => (
    <>
        {/* TODO: Make the background responsive */}
        <div className="absolute top-0 left-0 w-full h-full bg-no-repeat -z-10 flex overflow-hidden">
            <img className="w-2/5 h-full object-cover" src={cameraImage.src} />
            <div className="left-1/3 -skew-x-6 absolute w-full h-full overflow-hidden bg-gray-100 shadow-2xl"></div>
        </div>
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div>{logo}</div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    </>
)

export default AuthCard
