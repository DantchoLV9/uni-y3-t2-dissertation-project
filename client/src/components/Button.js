/**
 * @param {'primary' | 'info' | 'success' | 'warning' | 'danger'} color
 */
const Button = ({
    type = 'submit',
    color = 'primary',
    className,
    ...props
}) => {
    const colors = {
        primary: {
            bg: 'bg-gray-800',
            text: 'text-white',
            hover: 'hover:bg-gray-700',
            active: 'active:bg-gray-900',
            focus: 'focus:bg-gray-900',
            ring: 'ring-gray-300',
        },
        info: {
            bg: 'bg-blue-300',
            text: 'text-blue-900',
            hover: 'hover:bg-blue-200',
            active: 'active:bg-blue-400',
            focus: 'focus:bg-blue-400',
            ring: 'ring-blue-100',
        },
        success: {
            bg: 'bg-emerald-300',
            text: 'text-emerald-900',
            hover: 'hover:bg-emerald-200',
            active: 'active:bg-emerald-400',
            focus: 'focus:bg-emerald-400',
            ring: 'ring-emerald-100',
        },
        warning: {
            bg: 'bg-amber-300',
            text: 'text-amber-900',
            hover: 'hover:bg-amber-200',
            active: 'active:bg-amber-400',
            focus: 'focus:bg-amber-400',
            ring: 'ring-amber-100',
        },
        danger: {
            bg: 'bg-red-300',
            text: 'text-red-900',
            hover: 'hover:bg-red-200',
            active: 'active:bg-red-400',
            focus: 'focus:bg-red-400',
            ring: 'ring-red-100',
        },
    }
    return (
        <button
            type={type}
            className={`${className} inline-flex items-center px-4 py-2 ${colors[color].bg} border border-transparent rounded-md font-semibold text-xs ${colors[color].text} uppercase tracking-widest ${colors[color].hover} ${colors[color].active} focus:outline-none ${colors[color].focus} focus:ring ${colors[color].ring} disabled:opacity-25 transition ease-in-out duration-150`}
            {...props}
        />
    )
}

export default Button
