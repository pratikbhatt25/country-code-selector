declare module 'react-input-mask' {
    import * as React from 'react';
  
    interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
      mask: string;
      maskChar?: string | null;
      alwaysShowMask?: boolean;
      beforeMaskedValueChange?: (
        newState: { value: string; selection: { start: number | null; end: number | null } },
        oldState: { value: string; selection: { start: number | null; end: number | null } },
        userInput: string,
        maskOptions: any
      ) => { value: string; selection: { start: number | null; end: number | null } };
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
      onBlur?: React.FocusEventHandler<HTMLInputElement>;
      onFocus?: React.FocusEventHandler<HTMLInputElement>;
      value?: string;
    }
  
    const InputMask: React.FC<Props>;
  
    export default InputMask;
  }
  