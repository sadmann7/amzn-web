import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
};

const Meta = ({
  title = "Amzn Store",
  description = "An Amazon clone built with the t3-stack",
  image = "https://amzn-web.vercel.app/api/og?title=Amzn%20Store&description=An%20Amazon%20clone%20built%20with%20the%20t3-stack",
  keywords = "amazon, clone, t3-stack, nextjs, typescript, tailwindcss, react, vercel",
}: MetaProps) => {
  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
