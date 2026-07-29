import { SearchInitializer } from "@/components/web";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { query, category } = await searchParams;

  return <SearchInitializer query={query} category={category} />;
}
