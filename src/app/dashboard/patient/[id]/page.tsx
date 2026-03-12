interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <p>Id: {id}</p>
    </div>
  );
};

export default Page;
