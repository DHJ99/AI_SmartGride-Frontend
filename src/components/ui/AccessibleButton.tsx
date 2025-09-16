import React from 'react';
import { Button } from './Button';

interface AccessibleButtonProps extends React.ComponentProps<typeof Button> {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  role?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = (props) => {
  return <Button {...props} />;
};