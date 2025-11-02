const AvatarChat = ({ color, text, size = "md", url }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (!color) {
    color = [
      "bg-green-400",
      "bg-blue-400",
      "bg-cyan-400",
      "bg-yellow-400",
      "bg-purple-400",
    ][Math.floor(Math.random() * 5)];
  }

  return url ? (
    <img
      src={url}
      alt="Avatar"
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${color} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold`}
    >
      <span>{text}</span>
    </div>
  );
};

const AvatarPerson = ({ size = "md", person }) => {
  

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return person ? (
    <img
      src={person?.profile_picture}
      alt="Avatar"
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold`}
    >
      <span>{person?.given_name}</span>
    </div>
  );
};

const IconButton = ({ icon, onClick, className = "" }) => {
  return (
    <button
      className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-grey-light transition duration-200 text-neutral-600 dark:text-neutral-400 ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const TabButton = ({ text, isActive, onClick }) => {
  return (
    <button
      className={`font-['Montserrat'] px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
        isActive 
          ? "bg-brand-yellow dark:bg-brand-yellow-light text-brand-grey-dark shadow-sm" 
          : "bg-white dark:bg-brand-grey-light border border-neutral-200 dark:border-brand-grey-light text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-brand-grey-medium"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export { AvatarChat, AvatarPerson, IconButton, TabButton };
