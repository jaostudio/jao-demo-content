export function buildOG({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    title,
    description,
    type: "website",
    images: image
      ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
      : [],
  };
}
