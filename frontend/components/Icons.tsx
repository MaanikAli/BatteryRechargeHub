
import React from 'react';

const createIcon = (path: React.ReactNode) => {
    const IconComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
            {path}
        </svg>
    );
    return IconComponent;
};

export const PlusIcon = createIcon(
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
);

export const UserIcon = createIcon(
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
);

export const SearchIcon = createIcon(
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
);

export const ArrowLeftIcon = createIcon(
    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
);

export const ReceiptIcon = createIcon(
    <>
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
    </>
);

export const UserPlusIcon = createIcon(
    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" />
);

export const XIcon = createIcon(
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
);

export const CameraIcon = createIcon(
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A2 2 0 0012.414 4H7.586a2 2 0 00-1.414.586L5.586 5H4zm6 8a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
);

export const PencilIcon = createIcon(
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 14H4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-1h-2v-3z" />
);

export const WifiIcon = createIcon(
  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.47-5.47 14.332-5.47 19.802 0a1 1 0 01-1.414 1.414zM15.657 10.343a8 8 0 00-11.314 0 1 1 0 01-1.414-1.414 10 10 0 0114.142 0 1 1 0 01-1.414 1.414zM12.121 13.88a4 4 0 00-5.656 0 1 1 0 11-1.415-1.414 6 6 0 018.484 0 1 1 0 01-1.414 1.414zM10 16a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
);

export const WifiOffIcon = createIcon(
  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.47-5.47 14.332-5.47 19.802 0a1 1 0 01-1.414 1.414zM10 16a1 1 0 110 2 1 1 0 010-2zM3.515 9.879a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l2.828 2.828-1.414 1.414-3.535-3.535zm11.314-1.414a1 1 0 010 1.414l-3.535 3.535-1.415-1.414L14.12 9.172a1 1 0 011.414 0l.707.707z" clipRule="evenodd" />
);

export const SyncIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 11M20 20l-1.5-1.5A9 9 0 003.5 13" />
    </svg>
);

export const CheckCircleIcon = createIcon(
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
);

export const TrashIcon = createIcon(
  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
);

export const LogInIcon = createIcon(
  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v4a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 10-4 0 2 2 0 004 0zM4 10a1 1 0 011-1h1.586l.707-.707a2 2 0 012.828 0l.707.707H15a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
);

export const Spinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v1.268a8.017 8.017 0 010 9.464V16a1 1 0 11-2 0v-1.268a8.017 8.017 0 010-9.464V4a1 1 0 011-1zM5.293 5.293a1 1 0 011.414 0l.001.001A5.983 5.983 0 0110 7a5.983 5.983 0 013.292-1.706l.001-.001a1 1 0 111.414 1.414l-.001.001A5.983 5.983 0 0113 10a5.983 5.983 0 01-1.706 3.292l-.001.001a1 1 0 11-1.414-1.414l.001-.001A3.986 3.986 0 0011 10a3.986 3.986 0 00-2.293-1.293l-.001-.001a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
