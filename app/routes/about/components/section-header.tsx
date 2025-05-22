export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold">{title}</h2>
      <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
