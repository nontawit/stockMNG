import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function StockDisplay() {
  const [plan, setPlan] = useState('');
  const [position, setPosition] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductID, setEditProductID] = useState('');
  const [singleProduct, setSingleProduct] = useState({ productID: '', codeNo: '', productName: '', price: '', quantity: '' });
  const [multiProducts, setMultiProducts] = useState([{ productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);

  const fetchProducts = async () => {
    if (plan && position) {
      try {
        const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${plan}/${position}`);
        const sortedData = Object.entries(response.data)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => a.codeNo.localeCompare(b.codeNo));
        setProducts(sortedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/product', {
        position,
        ...singleProduct,
      });
      alert(response.data);
      fetchProducts();
      setSingleProduct({ productID: '', codeNo: '', productName: '', price: '', quantity: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const addMultipleProducts = async () => {
    try {
      const response = await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/products', multiProducts);
      alert(response.data);
      fetchProducts();
      setMultiProducts([{ productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);
    } catch (error) {
      console.error('Error adding multiple products:', error);
    }
  };

  const editProduct = async () => {
    try {
      const response = await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${editProductID}`, {
        ...singleProduct,
      });
      alert(response.data);
      fetchProducts();
      setIsEditing(false);
      setSingleProduct({ productID: '', codeNo: '', productName: '', price: '', quantity: '' });
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const deleteProduct = async (productID) => {
    try {
      const response = await axios.delete(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${productID}`);
      alert(response.data);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleMultiProductChange = (index, field, value) => {
    const newMultiProducts = [...multiProducts];
    newMultiProducts[index][field] = value;
    setMultiProducts(newMultiProducts);
  };

  const addNewProductField = () => {
    setMultiProducts([...multiProducts, { productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Stock Management System</h1>

      <div className="form-group">
        <label htmlFor="plan">Select Plan</label>
        <select className="form-control" id="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="">Choose Plan</option>
          <option value="Stock615">Stock615</option>
          <option value="Stock616">Stock616</option>
          <option value="Stock617">Stock617</option>
          <option value="Stock618">Stock618</option>
          <option value="Stock619">Stock619</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="position">Select Position</label>
        <select className="form-control" id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
          {[...Array(9).keys()].map((n) => (
            <option key={n} value={`0${n + 1}`}>{`0${n + 1}`}</option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mt-3" onClick={fetchProducts}>
        Show Products
      </button>

      {products.length > 0 && (
        <div className="table-responsive mt-4">
          <h2>Product List</h2>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Product ID</th>
                <th>Code No</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.productID}</td>
                  <td>{product.codeNo}</td>
                  <td>{product.productName}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => {
                        setIsEditing(true);
                        setEditProductID(product.id);
                        setSingleProduct(product);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-success mt-3" onClick={() => setIsEditing(false)}>
        Add New Product
      </button>

      {isEditing ? (
        <div className="card p-4 mt-4">
          <h2>Edit Product</h2>
          <form>
            {/* Add form fields similar to the single product form */}
            <button className="btn btn-primary mt-3" onClick={editProduct}>Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="card p-4 mt-4">
          <h2>Add Single Product</h2>
          <form>
            {/* Add single product form fields */}
            <button className="btn btn-primary mt-3" onClick={addProduct}>Add Product</button>
          </form>
        </div>
      )}

      <div className="card p-4 mt-4">
        <h2>Add Multiple Products</h2>
        {multiProducts.map((product, index) => (
          <div key={index}>
            {/* Add multiple products form fields */}
            <button className="btn btn-secondary mt-2" onClick={addNewProductField}>Add Another Product</button>
          </div>
        ))}
        <button className="btn btn-primary mt-3" onClick={addMultipleProducts}>Add All Products</button>
      </div>
    </div>
  );
}

export default StockDisplay;