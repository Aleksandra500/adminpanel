import type { Product } from '../types/Product';

interface Props {
	product: Product;
}

export default function CardComponents({ product }: Props) {
	const inStock = product.in_stock > 0;

	return (
		<div className='bg-white rounded-xl shadow-md p-5 transition hover:scale-[1.02] hover:shadow-lg'>
			<h2 className='text-lg font-semibold mb-2'>{product.name}</h2>

			<p className='text-xl font-bold mb-3'>${product.price}</p>

			<span
				className={`inline-block px-3 py-1 text-sm rounded-full ${
					inStock
						? 'bg-green-100 text-green-700'
						: 'bg-red-100 text-red-700'
				}`}>
				{inStock ? 'In stock' : 'Out of stock'}
			</span>
			<button
				className='mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300'
				disabled={!inStock}>
				Add to cart
			</button>
		</div>
	);
}
