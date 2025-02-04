import { client } from "@/sanity/lib/client"
import { Product } from "../../../../types/products"
import { groq } from "next-sanity"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"


interface ProductPageProps {
    params: Promise<{slug: string}>
}

async function getProduct(slug :string): Promise<Product> {
    return client.fetch(
        groq `*[_type == "product" && slug.current == $slug][0]{
        _id,
        title,
        _type,
        description,
        productImage,
        image,
        price,
        }` , {slug}
    )
}

export default async function ProductPage({params} : ProductPageProps){
     const {slug} = await params;
     const product = await getProduct(slug)

     return(
        <div className="max-w-7xl max-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-square">
                {product.productImage  && (
                   <Image
                        src={urlFor(product.productImage).url()}
                        alt={product.title}
                        width={500}
                        height={500}
                        className="rounded-lg shadow-md"
                    />
                    )}
                </div>
                <div className="flex flex-col gap-8">
                    <h1 className="text-4xl font-bold">
                        {product.title}
                    </h1>
                    <p className="text-2xl font-sans">
                        ${product?.price}
                    </p>
                    <p className="text-2xl font-sans">
                        {product?.description}
                    </p>
                </div>
            </div>
        </div>
     )
    
}

