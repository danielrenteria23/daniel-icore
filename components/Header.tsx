"use client";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        </div>
      </div>
    </header>
  );
}
