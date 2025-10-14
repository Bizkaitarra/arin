import React, { useState } from 'react';

interface SwipeWrapperProps {
    children: React.ReactNode;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

const SwipeWrapper: React.FC<SwipeWrapperProps> = ({ children, onSwipeLeft, onSwipeRight }) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0); // clear touch end position
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            onSwipeLeft();
        }
        if (isRightSwipe) {
            onSwipeRight();
        }
    };

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ height: '100%' }}
        >
            {children}
        </div>
    );
};

export default SwipeWrapper;
