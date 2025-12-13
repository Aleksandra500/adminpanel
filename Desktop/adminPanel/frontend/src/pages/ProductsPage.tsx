import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productsService';
import CardComponents from '../components/CardComponents';

interface Product {
	id: number;
	name: string;
	price: string;
	in_stock: number;
	created_at: string;
}

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await getAllProducts();
				if (res) {
					setProducts(res);
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Unknown error');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className='p-8'>
			<h1 className='text-3xl font-bold mb-8'>Products</h1>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
				{products.map((product) => (
					<CardComponents key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
