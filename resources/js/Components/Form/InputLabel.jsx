import React from 'react'

function InputLabel({ htmlFor, children, required = false }) {
    return (
        <label htmlFor={htmlFor} className="font-semibold text-gray-700 mb-0 text-sm">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    )
}

export default InputLabel