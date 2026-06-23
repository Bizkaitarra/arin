import React from 'react';

interface SafeAreaBottomProps {
    children: React.ReactNode;
    extraPadding?: number;
}

const SafeAreaBottom: React.FC<SafeAreaBottomProps> = ({ children, extraPadding = 16 }) => {
    return (
        <div style={{
            paddingBottom: `calc(var(--ion-safe-area-bottom, 0px) + ${extraPadding}px)`,
        }}>
            {children}
        </div>
    );
};

export default SafeAreaBottom;