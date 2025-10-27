import Image from "next/image";
import Link from "next/link";

interface ProductSpecifications {
  power: string;
  type: string;
  color: string;
  dimensions: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  thumbnail?: string;
  specifications: ProductSpecifications;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-neutral-50 rounded-xl p-2 flex flex-col gap-3 hover:border hover:border-[#ebebeb] transition-colors cursor-pointer">
        {/* White container */}
        <div className="bg-white rounded-lg p-2 flex flex-col gap-2.5 items-center">
          {/* Product Image */}
          <div className="h-[236px] w-[120px] relative">
            {product.image || product.thumbnail ? (
              <Image
                src={product.image || product.thumbnail || "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"}
                alt={product.name}
                width={120}
                height={236}
                className="w-full h-full object-cover"
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Specification Badges */}
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {/* Power Badge - Green */}
            <div className="bg-[#00b56a] flex items-center gap-1.5 px-2 py-1 rounded text-white">
              <img
                src="/assets/76ede529da07d1e31a85229e3153ff87a6d2cdfe.svg"
                alt="Power icon"
                className="w-3 h-3"
              />
              <span className="text-xs font-medium">
                Power:{" "}
                <span className="text-white/80">
                  {product.specifications.power}
                </span>
              </span>
            </div>

            {/* Type Badge - Gray */}
            <div className="bg-[#ebebeb] flex items-center gap-1.5 px-1.5 py-1 rounded">
              <img
                src="/assets/f90db6c737814d5a3e8aeb19b199986a961e2500.svg"
                alt="Type icon"
                className="w-3.5 h-3.5"
              />
              <span className="text-xs font-medium text-[#787878]">
                {product.specifications.type}
              </span>
            </div>

            {/* Color Badge - Gray */}
            <div className="bg-[#ebebeb] flex items-center gap-1.5 px-1.5 py-1 rounded">
              <img
                src="/assets/e37e2f55d0b3b1ff471b6ae0293e708fd1d7c945.svg"
                alt="Color icon"
                className="w-3.5 h-3.5"
              />
              <span className="text-xs font-medium text-[#787878]">
                {product.specifications.color}
              </span>
            </div>

            {/* Dimensions Badge - Gray */}
            <div className="bg-[#ebebeb] flex items-center gap-1.5 px-1.5 py-1 rounded">
              <img
                src="/assets/2b8314611987c4a602a282b9d038bf48fe8bc6c7.svg"
                alt="Dimensions icon"
                className="w-3.5 h-3.5"
              />
              <span className="text-xs font-medium text-[#787878]">
                {product.specifications.dimensions}
              </span>
            </div>
          </div>
        </div>

        {/* Product Name */}
        <p className="text-sm font-medium text-gray-900 text-center leading-normal">
          {product.name}
        </p>

        {/* Price */}
        <p className="text-sm font-medium text-gray-900 text-center">
          {product.price}
        </p>
      </div>
    </Link>
  );
}
