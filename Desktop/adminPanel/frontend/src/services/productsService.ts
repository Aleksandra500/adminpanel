
import axios from 'axios';

export const getAllProducts = async () =>
{
    try {
        const res = await axios.get('http://localhost:3000/api/products')
       if(res.status === 200 ){
        return res.data.results
       }
    } catch (err: unknown) {
        
        if (err instanceof Error){
         console.log('Error u getAllProducts servisu:', err.message)
           
        } else (
            console.log('Nepoznata greska u getAll servisu: ')
        )
         return [];
    }
}