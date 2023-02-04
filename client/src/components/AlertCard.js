import { useState } from 'react'
import CrossIcon from '@/images/crossIcon'

/**
 * @param {'primary' | 'info' | 'success' | 'warning' | 'danger'} type
 */
const AlertCard = ({
    dismissible = false,
    title,
    type = 'primary',
    className,
    children,
    dismissedCallback,
    ...props
}) => {
    const [dismissed, setDismissed] = useState(false)
    const handleDismiss = () => {
        setDismissed(true)
        if (dismissedCallback) {
            dismissedCallback();
        }
    }
    const colors = {
        primary: { bg: 'bg-gray-800', text: 'text-white' },
        info: { bg: 'bg-blue-300', text: 'text-blue-900' },
        success: { bg: 'bg-emerald-300', text: 'text-emerald-900' },
        warning: { bg: 'bg-amber-300', text: 'text-amber-900' },
        danger: { bg: 'bg-red-300', text: 'text-red-900' },
    }
    return (
        <>
            {dismissed || (
                <div
                    className={`${className} w-full mt-6 px-6 py-4 ${colors[type].bg} shadow-md overflow-hidden sm:rounded-lg`}
                    {...props}>
                    <div className="flex justify-between">
                        {title && (
                            <p className={`font-bold ${colors[type].text}`}>
                                {title}
                            </p>
                        )}
                        {dismissible && (
                            <button
                                onClick={handleDismiss}
                                className={`${colors[type].text} ml-auto`}>
                                <CrossIcon />
                            </button>
                        )}
                    </div>

                    <p className={`${colors[type].text}`}>{children}</p>
                </div>
            )}
        </>
    )
}

export default AlertCard
