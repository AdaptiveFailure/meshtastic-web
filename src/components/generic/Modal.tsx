import type React from 'react';

import { m } from 'framer-motion';

import { useAppSelector } from '@hooks/useAppSelector';

type DefaultDivProps = JSX.IntrinsicElements['div'];

export interface ModalProps extends DefaultDivProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({
  onClose,
  children,
  className,
  ...props
}: ModalProps): JSX.Element => {
  const darkMode = useAppSelector((state) => state.app.darkMode);

  return (
    <m.div className={`fixed inset-0 z-30 ${darkMode ? 'dark' : ''}`}>
      <m.div
        className="fixed w-full h-full backdrop-blur-sm backdrop-filter"
        onClick={onClose}
      />
      <m.div className="text-center ">
        <span
          className="inline-block h-screen align-middle "
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className={`inline-block align-middle ${className}`} {...props}>
          {children}
        </div>
      </m.div>
    </m.div>
  );
};
