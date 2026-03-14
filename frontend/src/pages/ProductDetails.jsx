import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails(){

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, []);

  if(!product) return <h2>Loading...</h2>

  return(
    <div>
      <img src={product.image} alt={product.name}/>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>₹{product.price}</h2>
    </div>
  )
}

export default ProductDetails;