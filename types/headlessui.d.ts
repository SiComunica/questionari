declare module '@headlessui/react' {
  import { ComponentProps, ElementType, ReactNode } from 'react'

  export interface DialogProps {
    as?: ElementType
    static?: boolean
    open?: boolean
    onClose: (value: boolean) => void
    children?: ReactNode
    className?: string
  }

  export interface TransitionProps {
    as?: ElementType
    show?: boolean
    enter?: string
    enterFrom?: string
    enterTo?: string
    leave?: string
    leaveFrom?: string
    leaveTo?: string
    children?: ReactNode
    className?: string
  }

  export const Dialog: React.FC<DialogProps> & {
    Title: React.FC<ComponentProps<any>>
    Description: React.FC<ComponentProps<any>>
    Panel: React.FC<ComponentProps<any> & { className?: string }>
  }

  export const Transition: React.FC<TransitionProps> & {
    Child: React.FC<TransitionProps>
    Root: React.FC<TransitionProps>
  }
}

declare module '@heroicons/react/24/outline' {
  export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>>
} 