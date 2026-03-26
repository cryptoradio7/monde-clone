"use client";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-black hover:text-white",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0a66c2] hover:text-white",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Partager :</span>
      {shares.map((share) => (
        <a
          key={share.label}
          href={share.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs border border-gray-300 px-2 py-1 transition-colors ${share.color}`}
        >
          {share.label}
        </a>
      ))}
    </div>
  );
}
