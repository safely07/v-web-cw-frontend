import { useNavigate, type To } from 'react-router-dom';
import { type ButtonHTMLAttributes } from 'react';

type PressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    moveTo?: To;
    onClick?: () => void;
    children: React.ReactNode;
};

export const PressButton = ({ 
    moveTo, 
    onClick, 
    children, 
    ...buttonProps 
}: PressButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onClick?.();
        
        if (moveTo) {
            navigate(moveTo);
        }
    };

    return (
        <button 
        onClick={handleClick}
        {...buttonProps}>
            {children}
        </button>
    );
};