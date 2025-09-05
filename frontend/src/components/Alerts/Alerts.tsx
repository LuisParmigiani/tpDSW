import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from './../../lib/utils.js';

const alertVariants = cva(
  // Removed grid classes from here
  'relative w-full rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        danger:
          'text-destructive bg-red-200 text-red-900 border-red-400 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        info: 'bg-blue-200 text-blue-900 border-blue-400',
        success: 'bg-green-200 text-green-900 border-green-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Alert({
  className,
  variant,
  onClose,
  autoClose,
  autoCloseDelay = 5000,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
  }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), 300);
  };

  useEffect(() => {
    if (autoClose && onClose) {
      const t = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => onClose?.(), 300);
      }, autoCloseDelay);
      return () => clearTimeout(t);
    }
  }, [autoClose, onClose, autoCloseDelay]);

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant }),
        'pr-10 transition-all duration-300 ease-in-out transform-gpu',
        isClosing
          ? 'opacity-0 scale-95 -translate-y-2'
          : 'opacity-100 scale-100 translate-y-0',
        className
      )}
      {...props}
    >
      {/* Content wrapper WITH grid (was previously on root) */}
      <div className="grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current">
        {props.children}
      </div>

      {onClose && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className={cn(
            'absolute top-2 right-2 w-6 h-6',
            'flex items-center justify-center rounded-full',
            'bg-black/5 hover:bg-black/10 active:bg-black/15',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-black/20',
            'cursor-pointer pointer-events-auto z-50'
          )}
        >
          <X className="h-4 w-4 pointer-events-none" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
