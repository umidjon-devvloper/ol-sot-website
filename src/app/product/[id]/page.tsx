import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serverApi } from "../../../services/apiServer";
import { ProductDetail } from "../../../components/ProductDetail";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await serverApi.getProduct(id);

  if (!data?.product) {
    return { title: "Mahsulot topilmadi" };
  }

  const product = data.product;
  const title = product.title?.uz || product.title?.en || "Mahsulot";
  const description = product.description?.uz || product.description?.en || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = await serverApi.getProduct(id);
  console.log("Product data:", data);
  if (!data?.product) {
    notFound();
  }

  return <ProductDetail product={data.product} similar={data.similar || []} />;
}

export const revalidate = 60;
