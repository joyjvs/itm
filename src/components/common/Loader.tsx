interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Loader = ({ size = 'md', message }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-muted border-t-primary rounded-full animate-spin`} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default Loader;